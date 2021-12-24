const MULTISIGN = {
  Signers: [
    {
      Signer: {
        Account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
        SigningPubKey:
          "029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15",
        TxnSignature:
          "3045022100D788CFBD76BB183D43E175191BD37965D01EFDD9D7F978B4DC7AED1F6421CA5B0220334448FEAF2A153EEF24FDFB7E4BC90BFFB29EBEB32342CEA3234F4737E9C967"
      }
    },
    {
      Signer: {
        Account: "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
        SigningPubKey:
          "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
        TxnSignature:
          "3045022100FC692AF1374D347C7E53205F165EF7F9AD3F96F558A2BE339947E277AB74447102204B8103DCA38AEC05A1EFD65C4E635242E882449B98328EAF13DC0DD2AFC0F239"
      }
    }
  ],
  SigningPubKey: ""
}

const MULTISIGN_JSON = {
  Flags: 0,
  Fee: 10000,
  TransactionType: "Payment",
  Account: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
  Amount: "1000000",
  Destination: "jLXCzapdDd1K11EtUv4Nz4agj8DPVbARjk",
  Sequence: 11,
  Fee: 20000,
  ...MULTISIGN
}

module.exports = {
  WSS_NODE: "wss://s.jingtum.com:5020",
  JT_NODE: "ws://swtcproxy.bcapps.ca:5020",
  JT_NODE_RPC: "http://swtcproxy.bcapps.ca:5050",
  JT_NODE_GM: "ws://39.99.226.235:5040",
  JT_NODE_GM_RPC: "http://39.99.226.235:4055",
  TEST_NODE: "ws://bcapps.ca:5020",
  TEST_NODE_GM: "ws://39.99.226.235:5040",
  TEST_NODE_RPC: "http://bcapps.ca:5050",
  TEST_NODE_GM_RPC: "http://39.99.226.235:4055",
  testAddress: "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
  testSecret: "shVCQFSxkF7DLXkrHY8X2PBKCKxS9",
  testAddressOffersGm: "jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis",
  // testAddressGm: "j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg",
  // testSecretGm: "shstwqJpVJbsqFA5uYJJw1YniXcDF",
  testAddressGm: "j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi",
  testSecretGm: "sndZWd9nbsHR34om4eS3B6zM7CeHe",
  testAddressGmEd: "ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF",
  testSecretGmEd: "sEdT6GjwtHJ86zSrj474iPpgNVUiX2r",
  testDestinationAddress: "jLXCzapdDd1K11EtUv4Nz4agj8DPVbARjk",
  // testDestinationAddressGm: "jQnYtxCSsTuxoTGRBcGp6U5Jeca1BmWsiE",
  testDestinationAddressGm: "ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF",
  testCreateHash:
    "DE0C9D201B6CAAEE81908B6D0AF9548BCE1073CD7B1C2E3541A2081B3537F5E9",
  testPlatform: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
  platform: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C",
  addressGm: "j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi",
  secretGm: "sndZWd9nbsHR34om4eS3B6zM7CeHe",
  // addressGm: "j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg",
  // secretGm: "shstwqJpVJbsqFA5uYJJw1YniXcDF",
  address_ed: "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt",
  secret_ed: "sEdTJSpen5J8ZA7H4cVGDF6oSSLLW2Y",
  address2: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
  address2Gm: "ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF",
  server: "http://swtcproxy.bcapps.ca:5080",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS",
  issuerGm: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W",
  blob_sign_ed25519:
    "1200002200000000240000000E6140000000000186A06840000000000027107321ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A6587637440FC0A0CD28AB6A18E14D990324E27AA39795FF5FA5FBEE8D055AEB3647BEC7E9DCF46401E9978B09B5F5836FFF82DFA9F3B8EA36C2E057F3FF23681E428B1630A81144B0DECFADE9D4170260CD5BA9EC1CF065CA8894683141359AA928F4D98FDB3D93E8B690C80D37DED11C3",
  blob_multisign_ed25519:
    "1200002200000000240000001E6140000000000F4240684000000000004E20730081141359AA928F4D98FDB3D93E8B690C80D37DED11C383144B0DECFADE9D4170260CD5BA9EC1CF065CA88946FCED73210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B87874463044022033E916B3B69AEC43635DC1E2B20F7F2D70008CB707AD42E4FDEC0779CBB801D802200FEE42CC77083D7B2A41FE54FCA26588F7CEA8C6B562157977241A6EB231A711811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463E1ED7321ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A6587637440CE5879F36F497BECADBDB2A1CB7C059E483EDD45C939882FCE61003FF9A23331840BD5F2636738305C95B0E201B73F1C25C4632EF163C647D4C741DF2503BE0781144B0DECFADE9D4170260CD5BA9EC1CF065CA88946E1F1",
  hash_blob_sign_ed25519:
    "0473C8FFF375E06EE763B5D63F351B231EC90F6BEE0170BB9158803F9DBCD267",
  hash_blob_multisign_ed25519:
    "5E524BED3E9BD03BA3F006A552F8510BD862E1070D5B08C7275E8890C5398747",
  MULTISIGN_JSON
}
