# SPHelper - ServiceNow Tools

A Chrome and Edge browser extension that provides powerful tools for ServiceNow Service Portal widget development and management.

## Features

- **Profile Management** - Manage multiple ServiceNow instances with different profiles
- **Code Snippets** - Store and organize reusable code snippets with multiple file types per snippet
  - Support for Client Scripts, Server Scripts, HTML Templates, CSS/SCSS, and General Code
  - Search functionality across all snippets
  - Copy, edit, and delete snippets
- **CSS/SCSS Variables** - Manage and organize CSS/SCSS variables
  - Add individual variables or bulk import
  - Export variables with custom prefix support
  - Search and filter functionality
- **Profile-Based Access Control** - Features are only available when a profile is selected

## Installation

### Chrome

1. **Download the extension files**
   - Clone or download this repository to your computer
   ```bash
   git clone https://github.com/yourusername/SPHelper.git
   ```

2. **Open Chrome Extensions Page**
   - Open Chrome and navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the SPHelper folder you downloaded
   - Select the folder containing `manifest.json`

5. **Confirm Installation**
   - The SPHelper extension should now appear in your extensions list
   - Click the extension icon in your toolbar to open it

### Edge

1. **Download the extension files**
   - Clone or download this repository to your computer
   ```bash
   git clone https://github.com/yourusername/SPHelper.git
   ```

2. **Open Edge Extensions Page**
   - Open Edge and navigate to `edge://extensions/`
   - Or go to Settings → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the bottom left corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the SPHelper folder you downloaded
   - Select the folder containing `manifest.json`

5. **Confirm Installation**
   - The SPHelper extension should now appear in your extensions list
   - Click the extension icon in your toolbar to open it

## Getting Started

### Creating Your First Profile

1. Click the SPHelper extension icon
2. Click the **"+ New"** button to create a new profile
3. Enter:
   - **Profile Name** - A name for this ServiceNow instance (e.g., "Dev", "Prod")
   - **Portal Link** - The URL to your ServiceNow instance (e.g., `https://your-instance.service-now.com/app/your_portal`)
4. Click **Save**
5. The profile will be automatically selected

### Managing Snippets

#### Adding a Snippet

1. Select a profile from the dropdown
2. Click **Snippets** from the main menu
3. Click the **"Add Snippet"** tab
4. Enter:
   - **Snippet Name** - A descriptive name
   - **File Type** - The type of code (Client Script, Server Script, HTML, CSS/SCSS, or General)
   - **Code** - Your code snippet
5. Click **"+ Add Snippet"**
6. You'll be automatically taken to the View tab to see your new snippet

#### Viewing Snippets

1. Click **Snippets** from the main menu
2. Snippets are displayed in the **View** tab with search functionality
3. Click on a file type label to expand and view the code
4. Use the buttons to:
   - **📋 Copy** - Copy the code to clipboard
   - **✏️ Edit** - Modify the snippet
   - **🗑️ Delete** - Remove the snippet (only shows for multi-file snippets)

#### Adding Multiple File Types to a Snippet

1. In the **View** tab, click **"➕ Add File"** next to the snippet name
2. Select a file type from the dropdown
3. Enter the code for that file type
4. Click **"Add"**
5. The new file type will be added as a tab to the snippet

#### Editing a Snippet

1. In the **View** tab, click on a file type to expand it
2. Click the **✏️ Edit** button
3. Modify the code in the modal
4. Click **Save**

#### Deleting a Snippet or File Type

- **Delete a file type** - Click the **🗑️ Delete** button under the file contents (for multi-file snippets only)
- **Delete entire snippet** - Click the **🗑️ Delete** button in the snippet header

### Managing CSS/SCSS Variables

#### Adding Variables

1. Select a profile from the dropdown
2. Click **CSS/SCSS Variables** from the main menu
3. Click the **"Add/Import"** tab
4. Enter:
   - **Variable Name** - Must start with `--` (CSS) or `$` (SCSS)
   - **Value** - The CSS value (color, size, etc.)
5. Click **"+ Add Variable"**

#### Bulk Importing Variables

1. In the **"Add/Import"** tab, click **"📥 Bulk Import"**
2. Paste your CSS variables (format: `--name: value;`) or SCSS variables (format: `$name: value;`)
3. Click **"Import Variables"**
4. Valid variables will be imported, invalid ones will be reported

#### Viewing Variables

1. Click **CSS/SCSS Variables** from the main menu
2. Variables are displayed in the **View** tab with search functionality
3. Use the buttons to:
   - **📋 Copy** - Copy the variable value
   - **✏️ Edit** - Modify the variable
   - **🗑️ Delete** - Remove the variable

#### Exporting Variables

1. In the **View** tab, click **"📤 Export"**
2. Select export format (CSS or SCSS)
3. Optionally enter a prefix for the variable names
4. Click **"Export"**
5. The variables will be copied to your clipboard

## Data Storage

All your data (profiles, snippets, and variables) is stored locally in your browser using localStorage.

- **Data is NOT shared** with any servers
- **Data is profile-specific** for variables
- **Data is global** for snippets (available across all profiles)

## Troubleshooting

### The extension isn't loading

1. Make sure you're in Developer Mode
2. Check that the `manifest.json` file is in the root of the extension folder
3. Try refreshing the extension by toggling it off and on

### My data disappeared

- Clearing browser cache/cookies will remove extension data
- Make sure you're using the same browser profile
- Try exporting your variables periodically for backup

### Profile dropdown won't work

- Make sure you've created at least one profile
- Check that the profile has both a name and URL

### Can't access CSS/SCSS Variables

- You must have a profile selected first
- Select a profile from the dropdown at the top of the extension
- The CSS/SCSS Variables button will be enabled once a profile is selected

## System Requirements

- **Chrome** - Version 88 or later
- **Edge** - Version 88 or later

## Support

For issues, suggestions, or questions:
1. Check the troubleshooting section above
2. Review the features section for detailed usage information
3. Open an issue on the GitHub repository

## License

This project is provided as-is for public use. See LICENSE file for details.

## Contributing

This is a read-only public repository. You can:
- **Clone and modify** for personal use
- **Report issues** via GitHub Issues
- **Suggest features** via GitHub Discussions

Pull requests cannot be merged directly, but your feedback is welcome!

---

**Version:** 1.0
**Last Updated:** 2024
