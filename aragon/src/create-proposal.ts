import {
    CreateMajorityVotingProposalParams,
    ProposalCreationSteps,
    TokenVotingClient,
    VoteValues,
  } from "@aragon/sdk-client";
  import { ProposalMetadata } from "@aragon/sdk-client-common";
  import { minimalContext } from "./context";
  
  // Create a TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(
    minimalContext,
  );
  
  const metadata: ProposalMetadata = {
    title: "Test Proposal",
    summary: "This is a short description",
    description: "This is a long description",
    resources: [
      {
        name: "Discord",
        url: "https://discord.com/...",
      },
      {
        name: "Website",
        url: "https://website...",
      },
    ],
    media: {
      logo: "https://...",
      header: "https://...",
    },
  };
  
  // Pin the metadata in IPFS to get back the URI.
  const metadataUri: string = await tokenVotingClient.methods.pinMetadata(
    metadata,
  );
  
  const pluginAddress: string = "0x73d0dCB71CDC2B9fB7b82A24EBE0a5774451dE7d"; // the address of the plugin contract containing all plugin logic.
  
  const proposalParams: CreateMajorityVotingProposalParams = {
    pluginAddress,
    metadataUri,
    actions: [],
    startDate: new Date(),
    endDate: new Date(),
    executeOnPass: false,
  };
  
  // Create a proposal where members participate through token voting.
  const steps = tokenVotingClient.methods.createProposal(proposalParams);
  
  for await (const step of steps) {
    try {
      switch (step.key) {
        case ProposalCreationSteps.CREATING:
          console.log({ txHash: step.txHash });
          break;
        case ProposalCreationSteps.DONE:
          console.log({ proposalId: step.proposalId });
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

    // {
  //   daoAddress: '0xaF7Cb662CF96F0CFa2185D308e7d5FC6DE94E5BF',
  //   pluginAddresses: [ '0x73d0dCB71CDC2B9fB7b82A24EBE0a5774451dE7d' ]
  // }