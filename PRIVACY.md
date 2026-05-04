# Privacy Policy — GitGlam

**Last updated:** May 4, 2026

## Overview

GitGlam is a Chrome extension that enhances the reading experience of GitHub markdown pages. It does **not** collect, store, transmit, or share any personal data or browsing information.

## Data Collection

GitGlam does **not** collect:

- Personally identifiable information
- Browsing history or web activity
- Page content, text, or images
- Authentication credentials
- Location data
- Financial information
- Health information
- Personal communications

## Data Storage

GitGlam uses Chrome's `storage.sync` API solely to save your extension preferences, such as:

- Selected theme
- Font size and column width
- Toggle states (focus mode, progress bar, animations, night shift)

These settings are stored locally in your browser and synced across your Chrome devices via your Google account. No data is sent to any external server.

## Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save and sync your extension preferences |
| `activeTab` | Communicate between the popup and the active tab to apply settings |
| Host access (`github.com`) | Inject content scripts to style markdown pages |

## Third Parties

GitGlam does not use any third-party services, analytics, tracking, or remote code.

## Changes

If this policy is updated, changes will be posted in this file within the GitGlam repository.

## Contact

If you have questions about this privacy policy, please open an issue at [https://github.com/istaari/GitGlam/issues](https://github.com/istaari/GitGlam/issues).
