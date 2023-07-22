import {
    Client,
    CreateDaoParams,
    DaoCreationSteps,
    DaoMetadata,
    TokenVotingPluginInstall,
    TokenVotingClient,
    VotingMode,
  } from "@aragon/sdk-client";
  import { GasFeeEstimation } from "@aragon/sdk-client-common";
  import { minimalContext } from "./context";
  
  // Instantiate the general purpose client from the Aragon OSx SDK context.
  const client: Client = new Client(minimalContext);
  
  const metadata: DaoMetadata = {
    name: "Project",
    description: "This is a description",
    avatar: "image-url",
    links: [{
      name: "Web site",
      url: "https://...",
    }],
  };
  
  // Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/
  const metadataUri = await client.methods.pinMetadata(metadata);
  
  // You need at least one plugin in order to create a DAO. In this example, we'll use the TokenVoting plugin, but feel free to install whichever one best suites your needs. You can find resources on how to do this in the plugin sections.
  // These would be the plugin params if you need to mint a new token for the DAO to enable TokenVoting.
  const tokenVotingPluginInstallParams: TokenVotingPluginInstall = {
    votingSettings: {
      minDuration: 60 * 60 * 24 * 2, // seconds
      minParticipation: 0.25, // 25%
      supportThreshold: 0.5, // 50%
    },
    useToken: {
        tokenAddress: "0x4C99A7B41f8dfA29c1BB4181FBd474291e927dAA", // contract address of the token to use as the voting token
        wrappedToken: {
          name: "GOV PEER", // the name of your token
          symbol: "GPT", // the symbol for your token. shouldn't be more than 5 letters
        },
      },
  };
  
  // Creates a TokenVoting plugin client with the parameteres defined above (with an existing token).
  const tokenVotingInstallItem = TokenVotingClient.encoding
    .getPluginInstallItem(tokenVotingPluginInstallParams, "maticmum");
  
  const createDaoParams: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "peerup", // my-org.dao.eth
    plugins: [tokenVotingInstallItem], // plugin array cannot be empty or the transaction will fail. you need at least one governance mechanism to create your DAO.
  };
  
  // Estimate how much gas the transaction will cost.
  const estimatedGas: GasFeeEstimation = await client.estimation.createDao(
    createDaoParams,
  );
  console.log({ avg: estimatedGas.average, maximum: estimatedGas.max });
  
  // Create the DAO.
  const steps = client.methods.createDao(createDaoParams);
  
  for await (const step of steps) {
    try {
      switch (step.key) {
        case DaoCreationSteps.CREATING:
          console.log({ txHash: step.txHash });
          break;
        case DaoCreationSteps.DONE:
          console.log({
            daoAddress: step.address,
            pluginAddresses: step.pluginAddresses,
          });
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }