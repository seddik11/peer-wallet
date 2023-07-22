import {
  byteEncoder,
  CircuitId,
  core,
  CredentialStatusType,
  FetchHandler,
  CircuitStorage,
  type W3CCredential,
  IndexedDBDataSource,
  IDataStorage,
  CredentialWallet,
  CredentialStatusResolverRegistry,
  IssuerResolver,
  RHSResolver,
  EthConnectionConfig,
  defaultEthConnectionConfig,
  CredentialStorage,
  IdentityStorage,
  Identity,
  Profile,
  MerkleTreeIndexedDBStorage,
  EthStateStorage,
  ICredentialWallet,
  IdentityWallet,
  InMemoryPrivateKeyStore,
  IndexedDBPrivateKeyStore,
  BjjProvider,
  KmsKeyType,
  KMS,
  CircuitData,
  AuthDataPrepareFunc,
  StateVerificationFunc,
  IPackageManager,
  DataPrepareHandlerFunc,
  VerificationHandlerFunc,
  VerificationParams,
  ProvingParams,
  PackageManager,
  ZKPPacker,
  PlainPacker,
  IIdentityWallet,
  IStateStorage,
  ICircuitStorage,
  ProofService,
  AuthHandler,
  ZeroKnowledgeProofRequest,
} from "@0xpolygonid/js-sdk";

import { proving } from "@iden3/js-jwz";
import { DID } from "@iden3/js-iden3-core";
import {
  createKYCAgeCredentialRequest,
  ZKPREQUEST,
} from "@/features/polygon-id/example-request";

export { W3CCredential } from "@0xpolygonid/js-sdk";
export { byteEncoder } from "@0xpolygonid/js-sdk";

export const getPolygonIdWallet = async (config: {
  rpcUrl: string;
  contractAddress: string;
  rhsUrl: string;
  keyPair: {
    publicKey: Buffer;
    privateKey: Uint8Array;
  };
  did?: DID;
  memory?: boolean;
}) => {
  console.log(`=== getPolygonIdWallet ===`, {
    rpcUrl: config.rpcUrl,
    did: config.did,
  });
  let circuitStorage: CircuitStorage | null = null;

  const dataStorage = initDataStorage({
    keyPair: config.keyPair,
    rpcUrl: config.rpcUrl,
    contractAddress: config.contractAddress,
  });

  const credentialWallet = initCredentialWallet({ dataStorage });
  const identityWallet = initIdentityWallet({
    privateKeyStorage: config.memory ? "memory" : "indexeddb",
    dataStorage,
    credentialWallet,
  });

  const createIdentity = async () => {
    return (
      await identityWallet.createIdentity({
        method: core.DidMethod.PolygonId,
        blockchain: core.Blockchain.Polygon,
        networkId: core.NetworkId.Mumbai,
        seed: config.keyPair.privateKey,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: config.rhsUrl,
        },
      })
    ).did;
  };
  if (
    config.did &&
    !(await dataStorage.identity.getIdentity(config.did.toString()))
  ) {
    throw new Error(`Identifier ${config.did.toString()} not found`);
  }
  const did = config.did ?? (await createIdentity());

  const initCircuits = async (props?: { circuitsFolder?: string }) => {
    console.log(`=== initCircuitStorageFetch ===`);
    circuitStorage = await initCircuitStorageFetch({
      circuitsFolder: props?.circuitsFolder ?? "/circuits",
    });
    console.log(`=== done initCircuitStorageFetch ===`);
    return circuitStorage;
  };

  const handleCredentialOffer = async (props: {
    credentialQrOffer: string;
    userDID: core.DID | string;
  }) => {
    if (!circuitStorage) throw new Error("circuitStorage is not initialized");
    const proofService = initProofService({
      identityWallet,
      credentialWallet,
      stateStorage: dataStorage.states,
      circuitStorage,
    });
    const authV2Data = await circuitStorage.loadCircuitData(CircuitId.AuthV2);
    const packageManager = initPackageManager(
      authV2Data,
      proofService.generateAuthV2Inputs.bind(proofService),
      proofService.verifyState.bind(proofService)
    );
    const fetchHandler = new FetchHandler(packageManager);
    const msgBytes = byteEncoder.encode(props.credentialQrOffer);
    const did = core.DID.parse(props.userDID.toString());
    const creds = await fetchHandler.handleCredentialOffer(did, msgBytes);
    console.log("handleCredentialOffer", creds);
    await credentialWallet.saveAll(creds);
    return creds;
  };

  const handleAuthOffer = async (props: { authRequest: string; did: DID }) => {
    const msgBytes = byteEncoder.encode(props.authRequest);
    if (!circuitStorage) throw new Error("circuitStorage is not initialized");
    const proofService = initProofService({
      identityWallet,
      credentialWallet,
      stateStorage: dataStorage.states,
      circuitStorage,
    });
    const authV2Data = await circuitStorage.loadCircuitData(CircuitId.AuthV2);
    const packageManager = initPackageManager(
      authV2Data,
      proofService.generateAuthV2Inputs.bind(proofService),
      proofService.verifyState.bind(proofService)
    );
    const authHandler = new AuthHandler(
      packageManager,
      proofService,
      credentialWallet
    );
    console.log("authRawRequest", {
      msgBytes,
      did: props.did,
    });
    const authHandlerRequest =
      await authHandler.handleAuthorizationRequestForGenesisDID(
        props.did,
        msgBytes
      );
    console.log("SUCCESS AUTH", JSON.stringify(authHandlerRequest, null, 2));

    // authenticate with the server

    /**
     * curl -X POST "http://localhost:3002/v1/authentication/callback" \
     *  -H "accept: application/json"\
     *  -H "content-type: text/plain" \
     *  -d 'jwz-token' \
     */
    if (!authHandlerRequest.authRequest.body?.callbackUrl)
      throw new Error("No callbackUrl");

    console.log(
      "authHandlerRequest.authRequest.body?.callbackUrl",
      authHandlerRequest.authRequest.body?.callbackUrl
    );
    console.log("authHandlerRequest.token", authHandlerRequest.token);
    const authResponse = await fetch(
      authHandlerRequest.authRequest.body?.callbackUrl,
      {
        method: "POST",
        body: authHandlerRequest.token,
      }
    );
    const authResponseJson = await authResponse.json();

    console.log("authResponseJson", authResponseJson);
  };

  const handleZKP = async (props: { userDID: DID }) => {
    if (!circuitStorage) throw new Error("circuitStorage is not initialized");
    console.log("handleZKP", props.userDID.toString());
    const proofReqSig: ZeroKnowledgeProofRequest =
      createKYCAgeCredentialRequest(CircuitId.AtomicQuerySigV2OnChain);

    let credsToChooseForZKPReq = await credentialWallet.findByQuery(
      proofReqSig.query
    );

    console.log("credsToChooseForZKPReq", credsToChooseForZKPReq);
    const proofService = initProofService({
      identityWallet,
      credentialWallet,
      stateStorage: dataStorage.states,
      circuitStorage,
    });

    console.log("proofService", {
      proofReqSig,
      userDID: props.userDID,
      credsToChooseForZKPReq: credsToChooseForZKPReq[0],
    });

    const proof = await proofService.generateProof(
      proofReqSig,
      props.userDID,
      credsToChooseForZKPReq[0]
    );

    const validated = await proofService.verifyProof(
      proof,
      CircuitId.AtomicQuerySigV2OnChain
    );

    console.log("validated", validated);

    console.log("proof", proof);

    return {
      proof,
      requestId: proofReqSig.id,
    };
  };

  return {
    did,
    initCircuits,
    handleCredentialOffer,
    handleAuthOffer,
    identityWallet,
    credentialWallet,
    handleZKP,
  };
};

function initCredentialWallet(props: {
  dataStorage: IDataStorage;
}): CredentialWallet {
  const statusRegistry = new CredentialStatusResolverRegistry();
  statusRegistry.register(
    CredentialStatusType.SparseMerkleTreeProof,
    new IssuerResolver()
  );
  statusRegistry.register(
    CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
    new RHSResolver(props.dataStorage.states)
  );
  return new CredentialWallet(props.dataStorage, statusRegistry);
}

async function initCircuitStorageFetch(props: { circuitsFolder: string }) {
  const cs = new CircuitStorage(new IndexedDBDataSource("circuitStorage"));
  try {
    console.time("check loading circuits from DB");
    await cs.loadCircuitData(CircuitId.AuthV2);
    console.timeEnd("check loading circuits from DB");
  } catch (e) {
    console.time("CircuitStorageInstance.init");
    const auth_w = await fetch(`${props.circuitsFolder}/authV2/circuit.wasm`)
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_w = await fetch(
      `${props.circuitsFolder}/credentialAtomicQueryMTPV2/circuit.wasm`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_w = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2/circuit.wasm`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const auth_z = await fetch(
      `${props.circuitsFolder}/authV2/circuit_final.zkey`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_z = await fetch(
      `${props.circuitsFolder}/credentialAtomicQueryMTPV2/circuit_final.zkey`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_z = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2/circuit_final.zkey`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    const auth_j = await fetch(
      `${props.circuitsFolder}/authV2/verification_key.json`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_j = await fetch(
      `${props.circuitsFolder}/credentialAtomicQueryMTPV2/verification_key.json`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_j = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2/verification_key.json`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    const sig_onchain = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2OnChain/verification_key.json`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    const sig_wasm = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2OnChain/circuit.wasm`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    const sig_zkey = await fetch(
      `${props.circuitsFolder}/credentialAtomicQuerySigV2OnChain/circuit_final.zkey`
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    console.timeEnd("CircuitStorageInstance.init");
    console.time("CircuitStorageInstance.saveCircuitData");
    await cs.saveCircuitData(CircuitId.AuthV2, {
      circuitId: "authV2".toString(),
      wasm: auth_w,
      provingKey: auth_z,
      verificationKey: auth_j,
    });
    await cs.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
      circuitId: "credentialAtomicQueryMTPV2".toString(),
      wasm: mtp_w,
      provingKey: mtp_z,
      verificationKey: mtp_j,
    });
    await cs.saveCircuitData(CircuitId.AtomicQuerySigV2, {
      circuitId: "credentialAtomicQuerySigV2".toString(),
      wasm: sig_w,
      provingKey: sig_z,
      verificationKey: sig_j,
    });
    await cs.saveCircuitData(CircuitId.AtomicQuerySigV2OnChain, {
      circuitId: "credentialAtomicQuerySigV2OnChain".toString(),
      wasm: sig_wasm,
      provingKey: sig_zkey,
      verificationKey: sig_onchain,
    });
    console.timeEnd("CircuitStorageInstance.saveCircuitData");
  }
  return cs;
}

const getStorageKey = (props: {
  publicyKey: Buffer;
  storageType: "credential" | "identity" | "profile";
}) => {
  return `@0xpolygonid_${
    props.storageType
  }_storage_/identity/${props.publicyKey.toString("hex")}`;
};

function initDataStorage(props: {
  keyPair?: {
    publicKey: Buffer;
    privateKey: Uint8Array;
  };
  contractAddress: string;
  rpcUrl: string;
}): IDataStorage {
  let credentialStorage;
  if (props.keyPair) {
    credentialStorage = new IndexedDBDataSource<W3CCredential>(
      getStorageKey({
        publicyKey: props.keyPair.publicKey,
        storageType: "credential",
      })
    );
  } else {
    credentialStorage = new IndexedDBDataSource<W3CCredential>("credential");
  }

  const conf: EthConnectionConfig = defaultEthConnectionConfig;
  conf.contractAddress = props.contractAddress;
  conf.url = props.rpcUrl;

  return {
    credential: new CredentialStorage(credentialStorage),

    identity: new IdentityStorage(
      new IndexedDBDataSource<Identity>(
        getStorageKey({
          publicyKey: props.keyPair?.publicKey ?? Buffer.from(""),
          storageType: "identity",
        })
      ),
      new IndexedDBDataSource<Profile>(
        getStorageKey({
          publicyKey: props.keyPair?.publicKey ?? Buffer.from(""),
          storageType: "profile",
        })
      )
    ),
    mt: new MerkleTreeIndexedDBStorage(40),
    states: new EthStateStorage(defaultEthConnectionConfig),
  };
}

function initIdentityWallet(props: {
  privateKeyStorage: "memory" | "indexeddb";
  dataStorage: IDataStorage;
  credentialWallet: ICredentialWallet;
}): IdentityWallet {
  const { privateKeyStorage, dataStorage, credentialWallet } = props;
  const privateKeyStore =
    privateKeyStorage === "memory"
      ? new InMemoryPrivateKeyStore()
      : new IndexedDBPrivateKeyStore();
  const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, privateKeyStore);
  const kms = new KMS();
  kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);
  return new IdentityWallet(kms, dataStorage, credentialWallet);
}

function initPackageManager(
  circuitData: CircuitData,
  prepareFn: AuthDataPrepareFunc,
  stateVerificationFn: StateVerificationFunc
): IPackageManager {
  const authInputsHandler = new DataPrepareHandlerFunc(prepareFn);

  const verificationFn = new VerificationHandlerFunc(stateVerificationFn);
  const mapKey =
    proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();
  const verificationParamMap: Map<string, VerificationParams> = new Map([
    [
      mapKey,
      {
        key: circuitData.verificationKey,
        verificationFn,
      },
    ],
  ]);

  const provingParamMap: Map<string, ProvingParams> = new Map();
  provingParamMap.set(mapKey, {
    dataPreparer: authInputsHandler,
    provingKey: circuitData.provingKey,
    wasm: circuitData.wasm,
  });

  const mgr: IPackageManager = new PackageManager();
  const packer = new ZKPPacker(provingParamMap, verificationParamMap);
  const plainPacker = new PlainPacker();
  mgr.registerPackers([packer, plainPacker]);

  return mgr;
}

function initProofService(props: {
  identityWallet: IIdentityWallet;
  credentialWallet: ICredentialWallet;
  stateStorage: IStateStorage;
  circuitStorage: ICircuitStorage;
}): ProofService {
  return new ProofService(
    props.identityWallet,
    props.credentialWallet,
    props.circuitStorage,
    props.stateStorage
  );
}
