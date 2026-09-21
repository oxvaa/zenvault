# Zenvault Bank & Co. 5.1.0 — Auth 5 & Admin Studio 6 Beta

## Auth 5
- Auth page has been redesigned into the Zenvault 5 Money OS visual language.
- New red/silver Z5 identity, cleaner glass surfaces, refreshed sign-in copy and stronger onboarding hierarchy.
- Registration, local-account login/import and existing credential compatibility are preserved.

## Zenvault 5 Themes
Three new application themes are included for all personal plans:
- **Bright Red**
- **Bright Red & Black** — always-dark Zenvault 5 theme
- **Bright Red & Silver**

Theme Studio now contains 36 themes in total. Standard plans can use 34 included themes; Unlimited/Prestige-class plans can access all 36 according to existing entitlements.

## Admin Studio 6 Beta
Admin Studio has been rebuilt as a detailed client console:
- client selector and client-level snapshot,
- net position, risk state, membership and activity metrics,
- per-currency account details,
- upgraded balance, transaction, points, membership and communication tools,
- card safety controls,
- security-lock reset,
- richer client detail and audit timeline.

### Negative balances
The balance tool can now deliberately set a client account below zero. A reason is mandatory, with presets for merchant coverage, enforcement, offline card settlement, reversed credits, bank obligations, accounting correction or a custom explanation.

A negative-balance change creates a visible bank-origin transaction and audit record with the previous balance, resulting balance and reason.

### Bank-origin transactions
Transactions created through Admin Studio now use **Banka** as their origin in Purchase Hub. Legacy admin balance adjustments labelled `Administrace` are displayed as `Banka` in transaction detail.

## Compatibility
- Existing `zenvault.bank.co.v2` local storage is preserved.
- 4.x and 5.0 local profiles migrate through the existing migration layer.
- Existing card/brand assets are unchanged.
