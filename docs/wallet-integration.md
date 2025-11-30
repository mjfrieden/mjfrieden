# Wallet Integration Guide

## Apple Wallet / Apple Health
1. Generate a Smart Health Card via the VaxPass UI.
2. Display the QR code on screen and scan with the iPhone camera.
3. iOS will recognize the SHC QR and offer to add the record to Apple Health/Wallet.
4. For local testing, ensure the SHC numeric payload starts with `shc:/` and that the QR code is crisp and at least 200x200.

## Google Wallet / Android
1. Generate the Smart Health Card QR.
2. Use Google Wallet or any SHC-compatible Android app to scan the QR.
3. Confirm the immunization record import.

## Tips
- The backend signs SHCs with a local ES256 key. Replace `SHC_SIGNING_KEY_PATH` with a production key path for real deployments.
- If you change the issuer or signing keys, wallets may treat cards as new issuers; keep issuer stable for continuity.
