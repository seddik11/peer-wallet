import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ethers } from "ethers";

export type Address = `0x${string}`;

const prefilledPrivateKeys = [
  "0xfc89215161dcbab444e1b0533ae1ff87128c7c4f1d607aaefec8fa6eb009ce2b",
  "0x75754ab240849ab7383ec69f093ba2b1b7be951ce1b1f7bf4ca196545f12dccd",
  "0x3c7cea24489951fc9054fed42de156451cfd58b1c034812932b6e359e8c3a018",
  "0xbb17e7e168f0a6ef85b7873e14fb66ce7a7236335e39fe96c0ba98542f73be00",
  "0x7cc395222373e8c51e0d90a265a9ff4b080cc9e03d6cb48753c359c264154ae9",
  "0x3f9fc796dfa9c0a9feb59e23aef854747d6bc1a3314e9b81501e652aa67bf5e3",
  "0x9286610a7678e6e3fc2187843ac0e30dc19d8e9efc55b1414b9127bae0af238d",
  "0xb31351cab8137161a4192e4b54d58b3a27777b5a259d058102a5861fafc34749",
  "0x2f527e5bd97a171e554ba426afbaec8c9cfc9b21a70ba90785d43236ef4848b3",
  "0x4a117eb5547211341063cadebb99b4b81b0087ce588fdbd1cb97944455fe5db6",
  "0xa0a30fb9a2496057f32911b4d4c089e0c79f685889e1b339ba2f0684c71fa3b6",
  "0x6433cbe7b894153a94aea745386ead0ef8019d55126a9b8b7fa493c946a68cd3",
  "0xeeb9037bb0381697517709e482f9a6882b68e066abf58e7b4127554afe7b6f38",
  "0x1418c54a1f0c6e23db3ee0a1c363f08c241a71e4433d2c9379af1b79b582498e",
  "0x9a59846859ac52ac258a88e76de96bd183d1ea911d373b985c386b78108a28b7",
  "0xa4d6d101f3c850ff2783074cc111a1edb37ac553da143ff9b0e363a1ba3f9776",
  "0xe0e64757f2f48b769383a997541ad160d494c891e0638bf8cdec209f9c5bc692",
  "0x0c79a6823b873a205a5241a5ba1cb72c562df3a0d01a6509cc8341ef5a1d3cc0",
  "0x61b25d62dc09351d29b65f54df6e77033a86f5e9ad3f6972e0173db646f0750b",
  "0xfa86ff16c54f7e4984111c616227a06c781e25a19fd89390e1895f25fe938984",
  "0xed1aa67091bf2ec6e0f1034c6c6a62ca2a38563b215e09b2148990774f101208",
  "0xf93d7c14cc7b08467e71085dd65eaa96ba5f6a68c902be29b7edb27142a4767b",
  "0x34ab596ba2b04cd6f25ebea09277dd43b7b4a01f4d0a8a930fa6dc413464f0b6",
  "0x360cb8b672c910a852827aa6442e89cb4e8ea455b6833c45c6223ba5e9dc4916",
  "0x9bf4f5cfe188f0cf4b58c3ccae66b465a8f37ff694dc40a680ddbdb1d7cd8624",
  "0x1ce69d2a97d3637e23daf99cd57819f001efde5288bb19ae757379a042cc742f",
  "0x04143e66c2500aab19b3458a1ede437c3acc912fa4126aed122f20cb0b807363",
  "0x587c23e3f1716b2833ed0c63b2989f1100e65f16933d091686b3f3899031da7b",
  "0xacff46f55afc4b788e3a9710debe3d39a279e6afcbf9739c4e98a80b900c986e",
  "0x5594d313abb36f84564f7cf228dc503e432ec3b5bed1bf296cd6496a00e93ff1",
  "0x2914276fcde7e462a5227020a354717c9ee8599844c350d4ee009338f87ec01c",
  "0xd46df61a17b6833142b8674e38ea0c041253e8f99ad0e5b57618ec835318a31e",
  "0xcd41b83bc88ee7ee41e5fc722bd209da21a2e03b3a96745fbe25c74d683872dd",
  "0x16021b25d89974a2a49ee033da0245dae3f1517bf4c7b80f5b5c2314930ea281",
  "0xc3f57f3c3d3b8827cbb06dcd3c3ff76430daa73b86295249e71f3ad34ba5f4d3",
  "0x473ca741fef5b890fca32b8c474fc54279962ed6427e25ebb6cf213fdb8fafc3",
  "0x95b395af3e62a16909d85fe64f69fc54f0f1b63f6baf72abd16cc23d228c1b67",
  "0x79fe707bc450ed4031422b3d80012a93ac757ef7cda7184d45e1ad0c3c5df609",
  "0x5dc352571faa1fdd8ada265c76ed811d8f3d9868e8be6c42026ff2a97ce55162",
  "0x9fdd2bc9c1ff96cccff42d8eb6d2df2718da43ddf511fd4ea905008089bd213d",
  "0xb78c6836060a416495ee3e797a4ea33b6e761843fc79738a35f754015e123cef",
  "0xfda5d3dfb32d85b5f52d6c143df88bc79ecc509ec53b572632ed0f1c04652e3f",
  "0x3395a3cd91906d4cef2e72005b4a0239f9a008b0c7b26e8b10d6695781b7245a",
  "0xadd2680ffc67813397855561147b30a808712650d47e0c780df36d99b3850b55",
  "0x8b0788d62e25aa96c1d139a80cf0da3b700487aec06deb957e87642a2c1713e6",
  "0x6501839ca974f9a606fadbd79ec1e4a4fded48f21f9bd8e64ad2cd5e1b7e9a5a",
  "0xb6421ec31db57c8729caafaae262a4a1dfa45d54e81c9f11963257ed1e198aeb",
  "0xd7a5757ca4d7b482879cf70bb88247783311d25ddb0858a148429da15ae82a66",
  "0x3f50e967a635eb631ddedd70ffddfdef94fc3739e1915ad763367d8626015bcd",
  "0x077af2c3ae6c010b12801b55654dfd88294c5bf1731b9db4002215c69c4d9636",
  "0xc64de074bc7cdbcf41c24d445ff0efd35be6bc7ae26fa694d10ff6ce222ee141",
  "0xa64b891418052df0416a64f6e1029d501713af310b6e6c1cbb2b44b21b8bfb7d",
  "0x26dba9ef4206587ae840c53af49a09f776dd91f5bd583a39542e51e40fdc1d45",
  "0x250846f917ac6a637a0bcffa64030bb49ad024e879e341f94334f5f38a75cec2",
  "0xfb4c098eacc7c34f990a8e930488b614b148d9e4290a145e1ebbbe01822c3816",
  "0xaa1d4f3ee65ebfcf3ace3f1702b2773041b6d4e593e4a2696aae0b04c3b72995",
  "0xc156ec5e20be7cf80ed4da77c855a279950cc069178fb090bd914ec08335aeef",
  "0x6280076e01332243a4b84dfc97878a95f19b10038cde38e4c2f7e270012221c6",
  "0xa3c0f3819dc3b1825ced7defdccf4dfa33b77087a177f52cc5921786b58ab760",
  "0x41ac7597477d10f0204e889ed1b2e3e307a0ef59d40ed62a1e1979c5483670f1",
  "0x6561a8a055f8cec398994820893e309b914966be5ded0bb853447c967db25fff",
  "0x28811529ce91a64c1cb91690061aa6ddd8e371f1a11385a678cd32f78452d08b",
  "0xe78f484a79c6062befb790b1ffcb3e0b63545905eac8fc7b301b0712539eeaa1",
  "0xa66f94168aac298d5c642ce2adee65382982df3146e970222f26842b4e088ace",
  "0xd4ca44f90c4953890dd9e9761ee55134c0148b7581c7d492330999d675159723",
  "0xff8a259682ef2a5e5184618949abf3c7c9e440f2bf82069be2196a863c6e9e3f",
  "0x2773235f4723a1ea274eb3608da1ee5c75c0e8385fb246660dc0bd58812fc492",
  "0xf5cba0abe21172e9c382ec93ece0536d32e97cb22735d8e6e6ce9fc518be7be6",
  "0xe4c2595610d2fb955dbb6eccfc02a664d1baa87e657c6e64834ed8782da1e4f5",
  "0xdf0400ea78b09092f957d756a819c5a8ea66536aa33fbc21d7c9aa234704bb81",
  "0x259271b9c3d6249061d3fe63ce7190f7855e5559fdc431ddaa0225e28932688c",
  "0x669def4168dad2ec6e7717b3cdb2b1f26428593c508d2806bf3c351f81435af9",
  "0x6c4f4ec49bb5ebc1b596820bd319733bd46d07af4016db36661bfbf99dcc9fe6",
  "0xcdd6dc61e7f8769dc59bbd1050dbe40a72dbce366313ea1ec93084b8133d3445",
  "0x4d64c7b0a1fd135e0f1af4f9821404bce5f2854aa6adc52c5fda4d1260066fe3",
  "0x5f1d89a6e1adcc5202dde47baef0efbefeca5c013e3391d8350be3ad9d678c87",
  "0x67ca44177585b643d80b308ad4f6e4f668facb00a164bfc5d4ae354f4c8dbada",
  "0x047b3e2d9e2e87c773ff7cb3273b980714f8daf05c4f9e5bb2c38967f93d0299",
  "0x138a351e4a8857f2bf2a079362756f5aa83c9efe58125f17a842e98fd336fbaf",
  "0xa678143e9d28df3464c81bb5a7f73859810c06db5d4249ab7c2cae10d223492e",
  "0x57e572a522be2a2bfbb7c61dc4543ce4b9994d3604dffce4def1e7ffd9b60e59",
  "0xa87a94b553e72befd1be19c35e43f474e24f4b0ad12e4510c2042b7015ed46e2",
  "0xbed89587575f0d8aef0b20bdea1a20643d290a8f1ee4f6de66a68dc7fb48a227",
  "0x7bbf2e4cac24838fd260f5c39b786d3bcea90db28e79c3f45813f3eb906a688f",
  "0x193ea8d4eeda082d04d6b4d83fab9f67db9c7277c2539bcfa21edf83aa86cb17",
  "0xeb5643ad40c9352ff142ea2a07b32cb718b4dce465f5627a8d47a4843d6e8dca",
  "0x75f9733bcde4c9727c56a057800940f98c42e0701c64109bddcff51e2e438da3",
  "0xda8f0624cd95df7ef6a94d66f93a33e0dbd146e7c42dd4f912ec2f1e519b0cd2",
  "0x404ef91dc692396ca2dd4fae25aa2204b843315bca6a47980c29132bcfed2fbb",
  "0xf115b53341b029904d71c77680626aa3d5539f27f5b218ed1c74623500c8002f",
  "0x9829594ba425fe5f0c41ef76518b616c81cdd024f47fdc77b168c6ec653d91e3",
  "0xf0233e8de8224f8b983acd9b19ce46f788feac1552e942397955ccf3d6e1f0f8",
  "0x21fe9347ae1707bfeb66f51f378de791efcfb669c916262c7445f933892088bc",
  "0x37b19aca4aee00fa53559090dddd367d32dc25e93fc1f8670dc9cab6ebe61aef",
  "0x9e058d706e9985ff1bcf6ffefc121c6088b02ba48d26608f0382214ff22dc08d",
  "0x2f0ce1fe0a582d669e571e7b30e032a2d8e31fc62cd7f45392d4a37b67a70d6b",
  "0x7016a02ab9c6f984456b592c986d5b8c34a8d639ac548b95873f3255e22f936a",
  "0x2a4b182f352d3bac5a0fe6746cf6b96614509c7ffd3b271abc54b261083769ca",
  "0x2937960706245d3ea4030b0485ea7d28aea29f7b48357cb1c4f12e35328cd0b2",
  "0x4e83ab8566d3444a74c079498ff67040f4f421295b045f3da47a42449b447985",
];

// pick randomly one of the private keys
const initBurnerWallet = new ethers.Wallet(
  prefilledPrivateKeys[Math.floor(Math.random() * prefilledPrivateKeys.length)]
);

export interface IBurnerStore {
  activeBurnerWallet?: ethers.Wallet;
  burnerWalletsKeys: string[];
  burnerWallets: ethers.Wallet[];
  generateBurnerWallet: () => void;
  removeBurnerWallet: (address: string) => void;
  selectBurnerWallet: (address: string) => void;
}

export const useBurnerWalletStore = create<IBurnerStore>()(
  persist(
    immer((set) => ({
      activeBurnerWallet: initBurnerWallet,
      burnerWalletsKeys: [initBurnerWallet.privateKey],
      burnerWallets: [initBurnerWallet],
      generateBurnerWallet: () => {
        set((store) => {
          // pick randomly one of the private keys, make sure it's not already in the list of burner wallets
          const privateKeys = prefilledPrivateKeys.filter(
            (key) => !store.burnerWalletsKeys.includes(key)
          );
          if (!privateKeys.length) {
            throw new Error("No more private keys available");
          }
          const privateKey =
            privateKeys[Math.floor(Math.random() * privateKeys.length)];
          const account = new ethers.Wallet(privateKey);
          store.burnerWalletsKeys.push(account.privateKey);
          store.burnerWallets.push(account);
        });
      },
      removeBurnerWallet: (address) => {
        set((store) => {
          store.burnerWallets = store.burnerWallets.filter(
            (account) => account.address !== address
          );
        });
      },
      selectBurnerWallet: (address) => {
        set((store) => {
          store.activeBurnerWallet = store.burnerWallets.find(
            (account) => account.address === address
          );
        });
      },
    })),
    {
      name: "burner-wallet-store",
    }
  )
);

export const useActiveBurnerWallet = () => {
  return useBurnerWalletStore((state) => state.activeBurnerWallet);
};
