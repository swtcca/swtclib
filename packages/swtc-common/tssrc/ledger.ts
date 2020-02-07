// Flags for ledger entries
export const LEDGER_FLAGS = {
  // Account Root
  account_root: {
    PasswordSpent: 0x00010000, // True, if password set fee is spent.
    RequireDestTag: 0x00020000, // True, to require a DestinationTag for payments.
    RequireAuth: 0x00040000, // True, to require a authorization to hold IOUs.
    DisallowSWT: 0x00080000, // True, to disallow sending SWT.
    DisableMaster: 0x00100000 // True, force regular key.
  },

  // Offer
  offer: {
    Passive: 0x00010000,
    Sell: 0x00020000 // True, offer was placed as a sell.
  },

  // Skywell State
  state: {
    LowReserve: 0x00010000, // True, if entry counts toward reserve.
    HighReserve: 0x00020000,
    LowAuth: 0x00040000,
    HighAuth: 0x00080000,
    LowNoSkywell: 0x00100000,
    HighNoSkywell: 0x00200000
  }
}

export const FLAGS = {
  OfferCreate: {
    Passive: 0x00010000,
    ImmediateOrCancel: 0x00020000,
    FillOrKill: 0x00040000,
    Sell: 0x00080000
  }
}

export const LEDGER_STATES = ["current", "closed", "validated"]
