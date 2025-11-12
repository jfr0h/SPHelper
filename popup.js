// Default snippets
const defaultSnippets = {
    'modal-embedded-widget-client': {
        name: 'Modal with Embedded Widget - Client Script',
        fileType: 'client',
        code: `c.openModal = function() {
    var modalOptions = {
        title: 'Widget Modal',
        template: 'path/to/template.html',
        scope: c.scope
    };
    spModal.open(modalOptions).then(function(data) {
        if (data) {
            c.onModalClose(data);
        }
    });
};

c.onModalClose = function(data) {
    // Handle returned data from modal
    console.log('Modal closed with data:', data);
    c.server.refresh();
};`
    },
    'modal-embedded-widget-html': {
        name: 'Modal with Embedded Widget - HTML Template',
        fileType: 'html',
        code: `<!-- Main widget template -->
<div class="widget-container">
    <button class="btn btn-primary" ng-click="c.openModal()">
        Open Modal
    </button>
    <div ng-if="c.data.modalResult">
        <p>Modal Result: {{c.data.modalResult}}</p>
    </div>
</div>

<!-- Modal template (separate snippet) -->
<div class="modal-body">
    <h3>{{title}}</h3>
    <ng-include src="'path/to/embedded-widget.html'"></ng-include>
</div>
<div class="modal-footer">
    <button class="btn btn-default" ng-click="$close()">Cancel</button>
    <button class="btn btn-primary" ng-click="$close(c.data.result)">Submit</button>
</div>`
    },
    'server-get-pattern-client': {
        name: 'c.server.get() Pattern - Client Script',
        fileType: 'client',
        code: `c.loadData = function() {
    c.server.get({
        action: 'fetchData',
        id: c.data.itemId
    }).then(function(response) {
        if (response.status === 'success') {
            c.data.records = response.data.records;
            c.data.count = response.data.count;
        } else {
            c.data.error = response.message;
        }
    });
};

// Initialize on page load
c.loadData();`
    },
    'server-get-pattern-server': {
        name: 'c.server.get() Pattern - Server Script',
        fileType: 'server',
        code: `if (input.action === 'fetchData') {
    var recordId = input.id;
    var gr = new GlideRecord('incident');

    if (gr.get(recordId)) {
        data.records = [{
            sys_id: gr.sys_id.toString(),
            number: gr.number.toString(),
            short_description: gr.short_description.toString()
        }];
        data.status = 'success';
    } else {
        data.status = 'error';
        data.message = 'Record not found';
    }
}`
    },
    'server-refresh-pattern-client': {
        name: 'c.server.refresh() Pattern - Client Script',
        fileType: 'client',
        code: `c.refreshData = function() {
    // Refresh server script without passing new data
    c.server.refresh();
};

c.updateAndRefresh = function() {
    // Update then refresh
    c.data.lastUpdated = new Date();
    c.server.refresh();
};

// Auto-refresh every 5 seconds
var refreshInterval = setInterval(function() {
    c.refreshData();
}, 5000);

// Clean up interval when widget is destroyed
c.$scope.$on('$destroy', function() {
    if (refreshInterval) clearInterval(refreshInterval);
});`
    },
    'server-refresh-pattern-server': {
        name: 'c.server.refresh() Pattern - Server Script',
        fileType: 'server',
        code: `// Server script runs automatically with refresh
var today = new Date();

data.timestamp = today.toISOString();
data.userName = gs.getUser().getName();
data.userId = gs.getUserID();

var gr = new GlideRecord('sys_user');
if (gr.get('sys_id', data.userId)) {
    data.userEmail = gr.email.toString();
}`
    },
    'table-filter-pagination-client': {
        name: 'Table with Filter & Pagination - Client Script',
        fileType: 'client',
        code: `c.itemsPerPage = 5;
c.currentPage = 1;
c.data.records = [];
c.data.filteredRecords = [];

c.loadRecords = function() {
    c.server.get({
        action: 'getAllRecords'
    }).then(function(response) {
        if (response.status === 'success') {
            c.data.records = response.data.records;
            c.applyFilter();
        }
    });
};

c.applyFilter = function() {
    var filtered = c.data.records;

    // Apply search filter
    if (c.data.searchTerm) {
        var term = c.data.searchTerm.toLowerCase();
        filtered = filtered.filter(function(item) {
            return item.number.toLowerCase().includes(term) ||
                   item.description.toLowerCase().includes(term);
        });
    }

    c.data.filteredRecords = filtered;
    c.data.totalPages = Math.ceil(filtered.length / c.itemsPerPage);
    c.currentPage = 1; // Reset to first page when filtering
};

c.getPageRecords = function() {
    var start = (c.currentPage - 1) * c.itemsPerPage;
    var end = start + c.itemsPerPage;
    return c.data.filteredRecords.slice(start, end);
};

c.nextPage = function() {
    if (c.currentPage < c.data.totalPages) {
        c.currentPage++;
    }
};

c.prevPage = function() {
    if (c.currentPage > 1) {
        c.currentPage--;
    }
};

c.$watch('c.data.searchTerm', function(newVal) {
    c.applyFilter();
});

c.loadRecords();`
    },
    'table-filter-pagination-html': {
        name: 'Table with Filter & Pagination - HTML Template',
        fileType: 'html',
        code: `<div class="table-widget">
    <!-- Search Input -->
    <div class="search-container">
        <input type="text"
               ng-model="c.data.searchTerm"
               placeholder="🔍 Search by number or description..."
               class="form-control">
    </div>

    <!-- Records Table -->
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Number</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
            </tr>
        </thead>
        <tbody>
            <tr ng-repeat="record in c.getPageRecords()">
                <td>{{record.number}}</td>
                <td>{{record.description}}</td>
                <td><span class="badge" ng-class="{'badge-success': record.status === 'Closed'}">{{record.status}}</span></td>
                <td>{{record.priority}}</td>
            </tr>
            <tr ng-if="c.data.filteredRecords.length === 0">
                <td colspan="4" class="text-center">No records found</td>
            </tr>
        </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination-container">
        <p>Page {{c.currentPage}} of {{c.data.totalPages}} | {{c.data.filteredRecords.length}} records found</p>
        <nav>
            <ul class="pagination">
                <li ng-class="{disabled: c.currentPage === 1}">
                    <a href ng-click="c.prevPage()">← Previous</a>
                </li>
                <li ng-repeat="page in [] | range:c.data.totalPages"
                    ng-class="{active: page === c.currentPage}">
                    <a href ng-click="c.currentPage = page">{{page}}</a>
                </li>
                <li ng-class="{disabled: c.currentPage === c.data.totalPages}">
                    <a href ng-click="c.nextPage()">Next →</a>
                </li>
            </ul>
        </nav>
    </div>
</div>`
    },
    'table-filter-pagination-css': {
        name: 'Table with Filter & Pagination - CSS/SCSS',
        fileType: 'css',
        code: `.table-widget {
    padding: 15px;
}

.search-container {
    margin-bottom: 20px;
}

.search-container input {
    font-size: 14px;
    padding: 8px 12px;
}

table {
    font-size: 13px;
    margin-bottom: 20px;
}

table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

table td {
    padding: 12px;
    vertical-align: middle;
}

.pagination-container {
    text-align: center;
    margin-top: 20px;
}

.pagination {
    display: inline-flex;
    list-style: none;
    padding: 0;
    gap: 5px;
}

.pagination li {
    border: 1px solid #ddd;
    border-radius: 3px;
}

.pagination a {
    display: block;
    padding: 8px 12px;
    cursor: pointer;
    text-decoration: none;
    color: #333;
}

.pagination li.active a {
    background-color: #293E40;
    color: white;
}

.pagination li.disabled a {
    color: #ccc;
    cursor: not-allowed;
}`
    },
    'table-filter-pagination-server': {
        name: 'Table with Filter & Pagination - Server Script',
        fileType: 'server',
        code: `if (input.action === 'getAllRecords') {
    var records = [];
    var gr = new GlideRecord('incident');
    gr.addQuery('active', 'true');
    gr.setLimit(100);
    gr.query();

    while (gr.next()) {
        records.push({
            sys_id: gr.sys_id.toString(),
            number: gr.number.toString(),
            description: gr.short_description.toString(),
            status: gr.state.toString(),
            priority: gr.priority.toString()
        });
    }

    data.records = records;
    data.status = 'success';
}`
    },
    'graphql-endpoint-client': {
        name: 'GraphQL $http Query - Client Script',
        fileType: 'client',
        code: `c.executeGraphQL = function(query, variables) {
    var url = '/api/now/graphql';

    var payload = {
        query: query,
        variables: variables || {}
    };

    c.data.loading = true;
    c.data.error = null;

    $http({
        method: 'POST',
        url: url,
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            'X-UserToken': $window.g_ck
        }
    }).then(function(response) {
        c.data.loading = false;

        if (response.data.errors) {
            c.data.error = response.data.errors[0].message;
            console.error('GraphQL Error:', c.data.error);
        } else {
            c.data.graphQLResult = response.data.data;
            console.log('GraphQL Response:', response.data.data);
        }
    }).catch(function(error) {
        c.data.loading = false;
        c.data.error = 'Request failed: ' + error.statusText;
        console.error('HTTP Error:', error);
    });
};

// Example: Query incidents
c.getIncidents = function() {
    var query = \`{
        now_incident(limit: 10) {
            edges {
                node {
                    sys_id
                    number
                    short_description
                    state
                    priority
                }
            }
        }
    }\`;

    c.executeGraphQL(query);
};

// Example: Query with variables
c.getIncidentById = function(incidentId) {
    var query = \`query getIncident(\$id: String!) {
        now_incident(filter: { sys_id: { eq: \$id } }) {
            edges {
                node {
                    sys_id
                    number
                    short_description
                    state
                    priority
                    assignment_group {
                        name
                    }
                }
            }
        }
    }\`;

    c.executeGraphQL(query, { id: incidentId });
};`
    },
    'graphql-endpoint-html': {
        name: 'GraphQL $http Query - HTML Template',
        fileType: 'html',
        code: `<div class="graphql-widget">
    <h3>GraphQL Query Widget</h3>

    <!-- Loading State -->
    <div ng-if="c.data.loading" class="alert alert-info">
        Loading...
    </div>

    <!-- Error State -->
    <div ng-if="c.data.error" class="alert alert-danger">
        Error: {{c.data.error}}
    </div>

    <!-- Query Buttons -->
    <div class="button-group">
        <button class="btn btn-primary" ng-click="c.getIncidents()">
            Load Incidents
        </button>
        <button class="btn btn-secondary" ng-click="c.getIncidentById('0011a00001G2E7AAW')">
            Load Specific Incident
        </button>
    </div>

    <!-- Results -->
    <div ng-if="c.data.graphQLResult" class="results">
        <h4>Results:</h4>
        <pre>{{c.data.graphQLResult | json}}</pre>

        <!-- Display as table example -->
        <table class="table" ng-if="c.data.graphQLResult.now_incident">
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Description</th>
                    <th>State</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="edge in c.data.graphQLResult.now_incident.edges">
                    <td>{{edge.node.number}}</td>
                    <td>{{edge.node.short_description}}</td>
                    <td>{{edge.node.state}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`
    },
    'graphql-endpoint-css': {
        name: 'GraphQL $http Query - CSS/SCSS',
        fileType: 'css',
        code: `.graphql-widget {
    padding: 15px;
    max-width: 800px;
}

.graphql-widget h3 {
    margin-bottom: 20px;
    color: #293E40;
    font-size: 16px;
}

.alert {
    padding: 12px 15px;
    margin-bottom: 15px;
    border-radius: 3px;
    border: 1px solid transparent;
}

.alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
    border-color: #bee5eb;
}

.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
}

.button-group {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.button-group button {
    padding: 10px 15px;
    font-size: 13px;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
    background: white;
    color: #333;
}

.button-group button.btn-primary {
    background-color: #293E40;
    color: white;
    border-color: #293E40;
}

.button-group button.btn-primary:hover {
    background-color: #3d5557;
}

.button-group button.btn-secondary {
    background-color: #82b6a2;
    color: white;
    border-color: #82b6a2;
}

.button-group button.btn-secondary:hover {
    background-color: #6ba392;
}

.results {
    background: #f8f8f8;
    padding: 15px;
    border-radius: 3px;
    margin-top: 20px;
    border: 1px solid #ddd;
}

.results pre {
    background: white;
    padding: 10px;
    border-radius: 3px;
    overflow-x: auto;
    max-height: 300px;
}`
    }
};


let currentEditingType = null;
let currentEditingId = null;
let currentProfile = null;
let currentEditingProfile = null;
let profiles = {};
let confirmCallback = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProfiles();
    setupProfileHandlers();
    setupMenuHandlers();
    setupSnippetHandlers();
    setupVariableHandlers();
    setupConfirmModal();
    setupSnippetHeaderToggle();
    restoreMenuState();
    restoreProfileFormState();
    restoreBulkImportModal();

    // Add keyboard support for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const profileModal = document.getElementById('profileModal');
            const editModal = document.getElementById('editModal');
            const bulkImportModal = document.getElementById('bulkImportModal');
            const confirmModal = document.getElementById('confirmModal');

            if (profileModal.classList.contains('active')) {
                closeProfileModal();
            } else if (editModal.classList.contains('active')) {
                closeModal();
            } else if (bulkImportModal.classList.contains('active')) {
                closeBulkImportModal();
            } else if (confirmModal.classList.contains('active')) {
                closeConfirmModal();
            }
        }
    });
});

// ===== PROFILE MANAGEMENT =====
function loadProfiles() {
    profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    updateProfileSelect();

    const savedProfile = localStorage.getItem('currentProfile');
    if (savedProfile && profiles[savedProfile]) {
        currentProfile = savedProfile;
        document.getElementById('profileSelect').value = currentProfile;
        updateOpenPortalBtn();
    }
}

function updateProfileSelect() {
    const select = document.getElementById('profileSelect');
    const selectedValue = select.value;

    select.innerHTML = '<option value="">-- Select Profile --</option>';

    Object.entries(profiles).forEach(([id, profile]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = profile.name;
        select.appendChild(option);
    });

    if (selectedValue && profiles[selectedValue]) {
        select.value = selectedValue;
    }
}

function setupProfileHandlers() {
    const profileSelect = document.getElementById('profileSelect');
    const newProfileBtn = document.getElementById('newProfileBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const openPortalBtn = document.getElementById('openPortalBtn');
    const inlineFormContainer = document.getElementById('profileFormContainer');
    const inlineProfileCancel = document.getElementById('inlineProfileCancel');
    const inlineProfileSave = document.getElementById('inlineProfileSave');

    // Prevent modal close when interacting with select
    profileSelect.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });

    profileSelect.addEventListener('change', function() {
        currentProfile = this.value;
        if (currentProfile) {
            localStorage.setItem('currentProfile', currentProfile);
            updateOpenPortalBtn();
            loadSnippets();
            loadVariables();
            showSection('mainMenu');
        }
        // Hide form if visible
        inlineFormContainer.style.display = 'none';
    });

    newProfileBtn.addEventListener('click', function() {
        currentEditingProfile = null;
        showInlineProfileForm(null);
    });

    editProfileBtn.addEventListener('click', function() {
        if (!currentProfile) {
            showStatus('Please select a profile first', 'error');
            return;
        }
        currentEditingProfile = currentProfile;
        showInlineProfileForm(profiles[currentProfile]);
    });

    openPortalBtn.addEventListener('click', function() {
        if (currentProfile && profiles[currentProfile].link) {
            chrome.tabs.create({ url: profiles[currentProfile].link });
        }
    });

    // Handle inline form buttons
    inlineProfileCancel.addEventListener('click', function(e) {
        e.preventDefault();
        closeInlineProfileForm();
    });

    inlineProfileSave.addEventListener('click', function(e) {
        e.preventDefault();
        saveInlineProfile();
    });

    // Save form state to localStorage to restore if popup is reopened
    document.getElementById('inlineProfileName').addEventListener('input', function() {
        localStorage.setItem('tempProfileName', this.value);
        localStorage.setItem('profileFormVisible', 'true');
        localStorage.setItem('profileFormMode', currentEditingProfile ? 'edit' : 'new');
    });

    document.getElementById('inlineProfileLink').addEventListener('input', function() {
        localStorage.setItem('tempProfileLink', this.value);
        localStorage.setItem('profileFormVisible', 'true');
        localStorage.setItem('profileFormMode', currentEditingProfile ? 'edit' : 'new');
    });
}

function showProfileModal(profileData) {
    const modal = document.getElementById('profileModal');
    const title = modal.querySelector('h3');

    if (profileData) {
        title.textContent = 'Edit Profile';
        document.getElementById('profileName').value = profileData.name;
        document.getElementById('profileLink').value = profileData.link;
    } else {
        title.textContent = 'New Profile';
        document.getElementById('profileName').value = '';
        document.getElementById('profileLink').value = '';
    }

    modal.classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
    currentEditingProfile = null;
}

function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const link = document.getElementById('profileLink').value.trim();

    if (!name || !link) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    if (currentEditingProfile) {
        // Update existing profile
        profiles[currentEditingProfile].name = name;
        profiles[currentEditingProfile].link = link;
    } else {
        // Create new profile
        const id = 'profile_' + Date.now();
        profiles[id] = {
            name: name,
            link: link
        };
    }

    localStorage.setItem('profiles', JSON.stringify(profiles));
    updateProfileSelect();
    closeProfileModal();
    showStatus('✓ Profile saved!', 'success');
}

function updateOpenPortalBtn() {
    const openPortalBtn = document.getElementById('openPortalBtn');
    if (currentProfile && profiles[currentProfile].link) {
        openPortalBtn.style.display = 'inline-block';
    } else {
        openPortalBtn.style.display = 'none';
    }
}

// ===== INLINE PROFILE FORM =====
function showInlineProfileForm(profileData) {
    const container = document.getElementById('profileFormContainer');
    const title = document.getElementById('profileFormTitle');
    const nameInput = document.getElementById('inlineProfileName');
    const linkInput = document.getElementById('inlineProfileLink');

    if (profileData) {
        title.textContent = 'Edit Profile';
        nameInput.value = profileData.name;
        linkInput.value = profileData.link;
    } else {
        title.textContent = 'New Profile';
        nameInput.value = localStorage.getItem('tempProfileName') || '';
        linkInput.value = localStorage.getItem('tempProfileLink') || '';
    }

    container.style.display = 'block';
    localStorage.setItem('profileFormVisible', 'true');
    localStorage.setItem('profileFormMode', profileData ? 'edit' : 'new');
    nameInput.focus();
}

function closeInlineProfileForm() {
    document.getElementById('profileFormContainer').style.display = 'none';
    localStorage.removeItem('tempProfileName');
    localStorage.removeItem('tempProfileLink');
    localStorage.removeItem('profileFormVisible');
    localStorage.removeItem('profileFormMode');
}

function saveInlineProfile() {
    const name = document.getElementById('inlineProfileName').value.trim();
    const link = document.getElementById('inlineProfileLink').value.trim();

    if (!name || !link) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    if (currentEditingProfile) {
        // Update existing profile
        profiles[currentEditingProfile].name = name;
        profiles[currentEditingProfile].link = link;
    } else {
        // Create new profile
        const id = 'profile_' + Date.now();
        profiles[id] = { name: name, link: link };
    }

    localStorage.setItem('profiles', JSON.stringify(profiles));
    updateProfileSelect();
    closeInlineProfileForm();
    currentEditingProfile = null;
    showStatus('✓ Profile saved!', 'success');
}

function restoreProfileFormState() {
    const isVisible = localStorage.getItem('profileFormVisible') === 'true';
    const formMode = localStorage.getItem('profileFormMode');

    if (isVisible) {
        if (formMode === 'edit' && currentProfile && profiles[currentProfile]) {
            currentEditingProfile = currentProfile;
            showInlineProfileForm(profiles[currentProfile]);
        } else if (formMode === 'new') {
            currentEditingProfile = null;
            showInlineProfileForm(null);
        }
    }
}

// ===== CONFIRMATION MODAL =====
function setupConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const confirmModalContent = confirmModal.querySelector('.modal-content');

    confirmOkBtn.addEventListener('click', function() {
        if (confirmCallback) {
            confirmCallback();
        }
        closeConfirmModal();
    });

    confirmCancelBtn.addEventListener('click', function() {
        closeConfirmModal();
    });

    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });

    confirmModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function showConfirmModal(title, message, callback) {
    confirmCallback = callback;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
}

// ===== SNIPPET HEADER TOGGLE =====
function setupSnippetHeaderToggle() {
    document.addEventListener('click', function(e) {
        const snippetHeader = e.target.closest('.snippet-header');
        if (snippetHeader) {
            const preview = snippetHeader.closest('.snippet-item').querySelector('.snippet-code-preview');
            if (preview) {
                preview.classList.toggle('show');
            }
        }
    });
}

// ===== MENU & NAVIGATION =====
function setupMenuHandlers() {
    // Main menu buttons
    document.querySelectorAll('.menu-btn[data-menu]').forEach(btn => {
        btn.addEventListener('click', function() {
            const menu = this.dataset.menu;
            showSection(menu + 'Section');
            saveMenuState(menu + 'Section', 'menu', null);

            // Load snippets or variables when section is shown
            if (menu === 'snippets') {
                loadSnippets();
            } else if (menu === 'variables') {
                loadVariables();
            }
        });
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showSection('mainMenu');
            saveMenuState('mainMenu', 'menu', null);
        });
    });

    // Submenu buttons
    document.querySelectorAll('.submenu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.section');
            const views = section.querySelectorAll('[id$="View"], [id$="Manage"]');

            views.forEach(view => view.classList.remove('active'));

            this.parentElement.querySelectorAll('.submenu-btn').forEach(b => {
                b.classList.remove('active');
            });

            this.classList.add('active');

            if (this.dataset.view === 'View') {
                section.querySelector('[id$="View"]').classList.add('active');
                // Load file type snippets when switching to View in snippets section
                if (section.id === 'snippetsSection') {
                    loadSnippets();
                } else if (section.id === 'variablesSection') {
                    loadVariables();
                }
            } else {
                section.querySelector('[id$="Manage"]').classList.add('active');
                // Load file type snippets when switching to Manage in snippets section
                if (section.id === 'snippetsSection') {
                    loadFileTypeSnippets();
                }
            }

            const sectionName = section.id.replace('Section', '');
            saveMenuState(section.id, 'submenu', this.dataset.view);
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// ===== SNIPPETS =====
function setupSnippetHandlers() {
    document.getElementById('addSnippetBtn').addEventListener('click', addSnippet);
    document.getElementById('newSnippetCode').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            addSnippet();
        }
    });

    // Event delegation for snippet actions
    document.addEventListener('click', function(e) {
        // Check for action buttons (both in View tab with .snippet-actions parent and Manage tab with .action-btn class)
        const copyBtn = e.target.closest('.copy-btn');
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (copyBtn && copyBtn.closest('.snippet-actions, [id*="fileType"], [class*="snippet-file-type"]')) {
            const snippetId = copyBtn.dataset.snippetId;
            copySnippet(snippetId);
        } else if (editBtn && editBtn.closest('.snippet-actions, [id*="fileType"], [class*="snippet-file-type"]')) {
            const snippetId = editBtn.dataset.snippetId;
            editSnippet(snippetId);
        } else if (deleteBtn && deleteBtn.closest('.snippet-actions, [id*="fileType"], [class*="snippet-file-type"]')) {
            const snippetId = deleteBtn.dataset.snippetId;
            deleteSnippetWithConfirm(snippetId);
        }
    });
}

function loadSnippets() {
    const customSnippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');
    const allSnippets = { ...defaultSnippets, ...customSnippets };
    const isCustom = (id) => id in customSnippets;

    let html = '';

    Object.entries(allSnippets).forEach(([id, snippet]) => {
        const preview = snippet.code.substring(0, 50).split('\n')[0];
        const custom = isCustom(id);

        html += `
            <div class="snippet-item">
                <div class="snippet-header">
                    <strong>${escapeHtml(snippet.name)}</strong>
                    <span class="snippet-preview">${escapeHtml(preview)}${preview.length >= 50 ? '...' : ''}</span>
                </div>
                <div class="snippet-code-preview">
                    <pre>${escapeHtml(snippet.code)}</pre>
                </div>
                <div class="snippet-actions">
                    <button class="action-btn copy-btn" data-snippet-id="${escapeHtml(id)}">📋 Copy</button>
                    <button class="action-btn edit-btn" data-snippet-id="${escapeHtml(id)}">✏️ Edit</button>
                    <button class="action-btn delete-btn" data-snippet-id="${escapeHtml(id)}">🗑️ Delete</button>
                </div>
            </div>
        `;
    });

    document.getElementById('snippetsView').innerHTML = html;
}

function loadFileTypeSnippets() {
    const customSnippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');
    const fileTypeContainer = document.getElementById('fileTypeContainer');

    if (!fileTypeContainer) return;

    const fileTypes = {
        'general': { label: '📝 General Code', icon: '📝' },
        'html': { label: '🏷️ HTML Template', icon: '🏷️' },
        'css': { label: '🎨 CSS/SCSS', icon: '🎨' },
        'client': { label: '💻 Client Script', icon: '💻' },
        'server': { label: '⚙️ Server Script', icon: '⚙️' }
    };

    // Group snippets by their display name (not by ID pattern)
    const snippetsByName = {};

    // Add all snippets (default and custom)
    const allSnippets = { ...defaultSnippets };
    Object.entries(customSnippets).forEach(([id, snippet]) => {
        allSnippets[id] = { ...snippet, isDefault: false };
    });

    Object.entries(allSnippets).forEach(([id, snippet]) => {
        const isCustom = id in customSnippets;
        // Extract base name from snippet name (e.g., "Modal with Embedded Widget" from "Modal with Embedded Widget - Client Script")
        const baseName = snippet.name.split(' - ')[0];

        if (!snippetsByName[baseName]) {
            snippetsByName[baseName] = [];
        }
        snippetsByName[baseName].push({ id, ...snippet, isDefault: !isCustom });
    });

    let html = '';

    Object.entries(snippetsByName).forEach(([baseName, snippets]) => {
        // Sort snippets so file types are in consistent order
        const fileTypeOrder = ['client', 'server', 'html', 'css', 'general'];
        snippets.sort((a, b) => {
            const aType = a.fileType || 'general';
            const bType = b.fileType || 'general';
            return fileTypeOrder.indexOf(aType) - fileTypeOrder.indexOf(bType);
        });

        const defaultBadge = snippets.some(s => s.isDefault) ? `<span style="font-size: 10px; background: var(--sn-secondary); color: white; padding: 2px 6px; border-radius: 2px; margin-left: 8px;">DEFAULT</span>` : '';

        // Single container for the entire snippet group
        html += `
            <div style="margin-bottom: 20px; border: 1px solid var(--sn-border); border-radius: 3px; overflow: hidden;">
                <!-- Header with snippet name -->
                <div style="padding: 12px 15px; background: var(--sn-bg-darker); border-bottom: 1px solid var(--sn-border);">
                    <strong style="font-size: 13px;">${escapeHtml(baseName)}${defaultBadge}</strong>
                </div>
        `;

        if (snippets.length === 1) {
            // Single file type - no tabs needed
            const snippet = snippets[0];
            html += `
                <div style="padding: 10px 15px;">
                    <div style="font-size: 11px; color: var(--sn-text-secondary); margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--sn-border);">
                        ${fileTypes[snippet.fileType || 'general'].label}
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button class="action-btn copy-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">📋 Copy</button>
                        <button class="action-btn edit-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">✏️ Edit</button>
                        <button class="action-btn delete-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">🗑️ Delete</button>
                    </div>
                </div>
            `;
        } else {
            // Multiple file types - show tabs at the top
            html += `
                <!-- File type tabs -->
                <div style="display: flex; border-bottom: 1px solid var(--sn-border); background: white;">
            `;
            snippets.forEach((snippet, idx) => {
                const fileType = snippet.fileType || 'general';
                const isActive = idx === 0;
                html += `
                    <button class="snippet-file-type-tab" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; padding: 10px 8px; border-right: ${idx < snippets.length - 1 ? '1px solid var(--sn-border)' : 'none'}; background: ${isActive ? 'var(--sn-secondary)' : 'white'}; color: ${isActive ? 'white' : 'var(--sn-text-primary)'}; border: none; cursor: pointer; font-size: 11px; font-weight: ${isActive ? 'bold' : 'normal'}; transition: all 0.2s;">
                        ${fileTypes[fileType].icon} ${fileTypes[fileType].label.split(' ')[1] || fileTypes[fileType].label}
                    </button>
                `;
            });
            html += `</div>`;

            // Tab contents area
            html += `<div style="padding: 10px 15px;">`;
            snippets.forEach((snippet, idx) => {
                const isActive = idx === 0;
                html += `
                    <div class="snippet-file-type-content" data-snippet-id="${escapeHtml(snippet.id)}" style="${isActive ? 'display: block' : 'display: none'}; padding: 10px 0;">
                        <div style="display: flex; gap: 4px;">
                            <button class="action-btn copy-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">📋 Copy</button>
                            <button class="action-btn edit-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">✏️ Edit</button>
                            <button class="action-btn delete-btn" data-snippet-id="${escapeHtml(snippet.id)}" style="flex: 1; font-size: 11px; padding: 6px;">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
    });

    fileTypeContainer.innerHTML = html;

    // Setup file type tab click handlers
    document.querySelectorAll('.snippet-file-type-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const snippetId = this.dataset.snippetId;
            const container = this.closest('[style*="border: 1px solid"]');

            // Deactivate all tabs in this container
            container.querySelectorAll('.snippet-file-type-tab').forEach(t => {
                t.style.background = 'white';
                t.style.color = 'var(--sn-text-primary)';
                t.style.fontWeight = 'normal';
            });

            // Hide all contents
            container.querySelectorAll('.snippet-file-type-content').forEach(content => {
                content.style.display = 'none';
            });

            // Activate clicked tab
            this.style.background = 'var(--sn-secondary)';
            this.style.color = 'white';
            this.style.fontWeight = 'bold';

            // Show corresponding content
            container.querySelector(`[data-snippet-id="${snippetId}"].snippet-file-type-content`).style.display = 'block';
        });
    });
}

function addSnippet() {
    if (!currentProfile) {
        showStatus('Please select a profile first', 'error');
        return;
    }

    const name = document.getElementById('newSnippetName').value.trim();
    const code = document.getElementById('newSnippetCode').value.trim();
    const fileType = document.getElementById('newSnippetType').value;

    if (!name || !code) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    let snippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');
    const id = 'snippet_' + Date.now();
    snippets[id] = { name, code, fileType: fileType || 'general' };

    localStorage.setItem(getGlobalStorageKey('customSnippets'), JSON.stringify(snippets));
    document.getElementById('newSnippetName').value = '';
    document.getElementById('newSnippetCode').value = '';
    document.getElementById('newSnippetType').value = 'general';

    loadSnippets();
    loadFileTypeSnippets();
    showStatus('✓ Snippet added!', 'success');
}

function copySnippet(id) {
    const allSnippets = {
        ...defaultSnippets,
        ...JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}')
    };

    if (allSnippets[id]) {
        const code = allSnippets[id].code;
        navigator.clipboard.writeText(code).then(() => {
            showStatus('✓ Copied to clipboard!', 'success');
        }).catch(() => {
            showStatus('Error copying to clipboard', 'error');
        });
    }
}

function editSnippet(id) {
    const customSnippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');
    const allSnippets = { ...defaultSnippets, ...customSnippets };

    if (allSnippets[id]) {
        currentEditingType = 'snippet';
        currentEditingId = id;
        showEditModal(allSnippets[id], 'snippet');
    }
}

function deleteSnippetWithConfirm(id) {
    showConfirmModal('Delete Snippet', 'Are you sure you want to delete this snippet?', function() {
        deleteSnippet(id);
    });
}

function deleteSnippet(id) {
    // Check if it's a default snippet
    if (id in defaultSnippets) {
        showStatus('Cannot delete default snippets', 'error');
        return;
    }

    let snippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');
    delete snippets[id];
    localStorage.setItem(getGlobalStorageKey('customSnippets'), JSON.stringify(snippets));
    loadSnippets();
    loadFileTypeSnippets();
    showStatus('✓ Snippet deleted!', 'success');
}

// ===== VARIABLES =====
function setupVariableHandlers() {
    const addVarBtn = document.getElementById('addVarBtn');
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    const bulkImportText = document.getElementById('bulkImportText');

    if (addVarBtn) {
        addVarBtn.addEventListener('click', addVariable);
    }

    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', showBulkImportModal);
    }

    if (bulkImportText) {
        bulkImportText.addEventListener('input', function() {
            localStorage.setItem('bulkImportText', this.value);
        });
    }

    // Event delegation for variable actions
    document.addEventListener('click', function(e) {
        const copyBtn = e.target.closest('.variable-actions .copy-btn');
        const editBtn = e.target.closest('.variable-actions .edit-btn');
        const deleteBtn = e.target.closest('.variable-actions .delete-btn');

        if (copyBtn) {
            const varName = copyBtn.dataset.varName;
            copyVariable(varName);
        } else if (editBtn) {
            const varName = editBtn.dataset.varName;
            editVariable(varName);
        } else if (deleteBtn) {
            const varName = deleteBtn.dataset.varName;
            deleteVariableWithConfirm(varName);
        }
    });

    // Handle edit modal close on overlay click (only set up once)
    const editModal = document.getElementById('editModal');
    const editModalContent = editModal.querySelector('.modal-content');

    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeModal();
        }
    });

    editModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Handle bulk import modal close on overlay click (only set up once)
    const bulkImportModal = document.getElementById('bulkImportModal');
    const bulkImportModalContent = bulkImportModal.querySelector('.modal-content');

    bulkImportModal.addEventListener('click', function(e) {
        if (e.target === bulkImportModal) {
            closeBulkImportModal();
        }
    });

    bulkImportModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Handle edit modal buttons
    const editCancelBtn = document.getElementById('editCancelBtn');
    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    const editSaveBtn = document.getElementById('editSaveBtn');
    if (editSaveBtn) {
        editSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveEdit();
        });
    }

    // Handle bulk import modal buttons
    const bulkImportCancelBtn = document.getElementById('bulkImportCancelBtn');
    if (bulkImportCancelBtn) {
        bulkImportCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeBulkImportModal();
        });
    }

    const bulkImportSaveBtn = document.getElementById('bulkImportSaveBtn');
    if (bulkImportSaveBtn) {
        bulkImportSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveBulkImport();
        });
    }
}

function setupVariableSearch() {
    const searchInput = document.getElementById('variableSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const variableItems = document.querySelectorAll('.variable-item');

        variableItems.forEach(item => {
            const searchData = item.dataset.varSearch || '';
            if (searchTerm === '' || searchData.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function isValidCSSColor(value) {
    // Whitelist valid CSS color formats
    const colorPatterns = [
        /^#[0-9A-F]{3}$/i,           // #abc
        /^#[0-9A-F]{6}$/i,           // #abcdef
        /^#[0-9A-F]{8}$/i,           // #abcdef00 (with alpha)
        /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,  // rgb(255, 0, 0)
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i,  // rgba(255, 0, 0, 0.5)
        /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i,  // hsl(0, 100%, 50%)
        /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i,  // hsla(0, 100%, 50%, 0.5)
    ];

    // Check against known CSS color names
    const colorNames = ['red', 'blue', 'green', 'white', 'black', 'transparent', 'inherit', 'current', 'currentColor'];

    return colorPatterns.some(pattern => pattern.test(value)) || colorNames.includes(value.toLowerCase());
}

function convertToCSS(scssVariables, prefix = '') {
    let cssOutput = ':root {\n';

    Object.entries(scssVariables).forEach(([key, value]) => {
        const sassName = key.replace(/^\$/, '').replace(/^--/, '');

        let cssVarName = '--' + sassName;
        if (prefix) {
            cssVarName = '--' + prefix + '-' + sassName;
        }

        cssOutput += `  ${cssVarName}: ${value};\n`;
    });

    cssOutput += '}';

    return cssOutput;
}

function getCSSSyntax(name, prefix = '') {
    const baseName = name.startsWith('$') ? name.substring(1) : name.replace(/^--/, '');
    let cssVarName = '--' + baseName;

    if (prefix) {
        cssVarName = '--' + prefix + '-' + baseName;
    }

    return cssVarName;
}

function loadVariables() {
    if (!currentProfile) {
        document.getElementById('variablesListContainer').innerHTML = '';
        updateExportBtn();
        return;
    }

    const variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');
    const exportPrefix = localStorage.getItem(getStorageKey('exportPrefix')) || '';
    window.allVariables = variables; // Store for search functionality

    let html = '';
    Object.entries(variables).forEach(([name, value]) => {
        const isColor = isValidCSSColor(value);
        const colorSquare = isColor ? `<div class="color-square" style="background-color: ${value};"></div>` : '';
        const cssName = getCSSSyntax(name, exportPrefix);

        html += `
            <div class="variable-item" data-var-search="${escapeHtml(name).toLowerCase()} ${escapeHtml(cssName).toLowerCase()}">
                <div class="variable-header">
                    ${colorSquare}
                    <div class="variable-content">
                        <strong>${escapeHtml(name)}</strong>
                        <span class="variable-value" style="font-size: 11px; color: var(--sn-text-secondary); margin-top: 2px;">CSS: <code style="background: var(--sn-bg-darker); padding: 2px 4px; border-radius: 2px;">${escapeHtml(cssName)}</code></span>
                        <span class="variable-value">${escapeHtml(value)}</span>
                    </div>
                </div>
                <div class="variable-actions">
                    <button class="action-btn copy-btn" data-var-name="${escapeHtml(name)}">📋 Copy</button>
                    <button class="action-btn edit-btn" data-var-name="${escapeHtml(name)}">✏️ Edit</button>
                    <button class="action-btn delete-btn" data-var-name="${escapeHtml(name)}">🗑️ Delete</button>
                </div>
            </div>
        `;
    });

    document.getElementById('variablesListContainer').innerHTML = html;
    updateExportBtn();
    setupVariableSearch();
}

function isValidVariableName(name) {
    // Validate CSS variable naming: must start with -- or $, followed by alphanumeric, dash, or underscore
    const cssVarPattern = /^--[a-zA-Z0-9\-_]+$/;
    const scssVarPattern = /^\$[a-zA-Z0-9\-_]+$/;
    return cssVarPattern.test(name) || scssVarPattern.test(name);
}

function addVariable() {
    if (!currentProfile) {
        showStatus('Please select a profile first', 'error');
        return;
    }

    const name = document.getElementById('newVarName').value.trim();
    const value = document.getElementById('newVarValue').value.trim();

    if (!name || !value) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    if (!isValidVariableName(name)) {
        showStatus('Variable name must start with -- or $ and contain only alphanumeric, dash, or underscore characters', 'error');
        return;
    }

    let variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');

    if (name in variables) {
        showStatus('Variable with this name already exists', 'error');
        return;
    }

    variables[name] = value;

    localStorage.setItem(getStorageKey('cssVariables'), JSON.stringify(variables));
    document.getElementById('newVarName').value = '';
    document.getElementById('newVarValue').value = '';

    loadVariables();
    showStatus('✓ Variable added!', 'success');
}

function copyVariable(name) {
    const variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');
    if (variables[name]) {
        navigator.clipboard.writeText(variables[name]).then(() => {
            showStatus('✓ Copied to clipboard!', 'success');
        }).catch(() => {
            showStatus('Error copying to clipboard', 'error');
        });
    }
}

function editVariable(name) {
    const variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');
    if (variables[name]) {
        currentEditingType = 'variable';
        currentEditingId = name;
        showEditModal({ name: name, value: variables[name] }, 'variable');
    }
}

function deleteVariableWithConfirm(name) {
    showConfirmModal('Delete Variable', 'Are you sure you want to delete this variable?', function() {
        deleteVariable(name);
    });
}

function deleteVariable(name) {
    let variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');
    delete variables[name];
    localStorage.setItem(getStorageKey('cssVariables'), JSON.stringify(variables));
    loadVariables();
    showStatus('✓ Variable deleted!', 'success');
}

function updateExportBtn() {
    const viewContainer = document.getElementById('variablesViewActions');

    if (!viewContainer) return;

    // Create/update button in View section only
    if (!viewContainer.querySelector('#exportCssVarsBtn')) {
        const exportBtn = document.createElement('button');
        exportBtn.id = 'exportCssVarsBtn';
        exportBtn.className = 'menu-btn';
        exportBtn.textContent = '📤 Export';
        exportBtn.style.background = '#82b6a2';
        exportBtn.style.color = 'white';
        exportBtn.style.borderColor = '#82b6a2';
        exportBtn.style.padding = '8px 12px';
        exportBtn.style.fontSize = '13px';
        exportBtn.addEventListener('click', exportCssVariables);
        viewContainer.appendChild(exportBtn);
    }
}

function exportCssVariables() {
    const variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');

    if (Object.keys(variables).length === 0) {
        showStatus('No variables to export', 'error');
        return;
    }

    const prefix = prompt('Enter prefix for CSS variables (optional, e.g., "myapp"):', localStorage.getItem(getStorageKey('exportPrefix')) || '');
    if (prefix === null) return; // User cancelled

    // Save the prefix for future displays
    if (prefix) {
        localStorage.setItem(getStorageKey('exportPrefix'), prefix);
    } else {
        localStorage.removeItem(getStorageKey('exportPrefix'));
    }

    const cssOutput = convertToCSS(variables, prefix);

    navigator.clipboard.writeText(cssOutput).then(() => {
        const varCount = Object.keys(variables).length;
        showStatus(`✓ Exported ${varCount} variable${varCount !== 1 ? 's' : ''} to clipboard!`, 'success');
        // Reload variables to show the prefix in CSS names
        loadVariables();
    }).catch(() => {
        showStatus('Error copying to clipboard', 'error');
    });
}

function showBulkImportModal() {
    const modal = document.getElementById('bulkImportModal');
    const textarea = document.getElementById('bulkImportText');

    // Restore previous input if it exists
    const savedInput = localStorage.getItem('bulkImportText');
    if (savedInput) {
        textarea.value = savedInput;
    }

    modal.classList.add('active');
    localStorage.setItem('bulkImportVisible', 'true');
    textarea.focus();
}

function closeBulkImportModal() {
    document.getElementById('bulkImportModal').classList.remove('active');
    localStorage.removeItem('bulkImportText');
    localStorage.removeItem('bulkImportVisible');
}

function restoreBulkImportModal() {
    const isVisible = localStorage.getItem('bulkImportVisible') === 'true';
    if (isVisible) {
        showBulkImportModal();
    }
}

function saveBulkImport() {
    if (!currentProfile) {
        showStatus('Please select a profile first', 'error');
        return;
    }

    const input = document.getElementById('bulkImportText').value.trim();
    const variables = parseVariables(input);

    if (variables.length === 0) {
        showStatus('No valid variables found', 'error');
        return;
    }

    let existingVars = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');

    variables.forEach(variable => {
        existingVars[variable.name] = variable.value;
    });

    localStorage.setItem(getStorageKey('cssVariables'), JSON.stringify(existingVars));
    document.getElementById('bulkImportText').value = '';
    closeBulkImportModal();
    loadVariables();
    showStatus(`✓ ${variables.length} variables imported!`, 'success');
}

// ===== EDIT MODAL =====
function showEditModal(data, type) {
    const modal = document.getElementById('editModal');
    const title = modal.querySelector('h3');
    const nameInput = document.getElementById('editName');
    const codeInput = document.getElementById('editCode');
    const codeLabel = modal.querySelector('label[for="editCode"]');

    if (type === 'snippet') {
        title.textContent = 'Edit Snippet';
        codeLabel.textContent = 'Code:';
        nameInput.value = data.name;
        codeInput.value = data.code;
        codeInput.style.display = 'block';
    } else {
        title.textContent = 'Edit Variable';
        codeLabel.textContent = 'Value:';
        nameInput.value = data.name;
        codeInput.value = data.value;
        codeInput.style.display = 'block';
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingType = null;
    currentEditingId = null;
}

function saveEdit() {
    const name = document.getElementById('editName').value.trim();
    const value = document.getElementById('editCode').value.trim();

    if (!name || !value) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    if (currentEditingType === 'snippet') {
        let snippets = JSON.parse(localStorage.getItem(getGlobalStorageKey('customSnippets')) || '{}');

        // If editing a default snippet, create a new custom snippet instead
        if (currentEditingId in defaultSnippets) {
            const newId = 'snippet_' + Date.now();
            snippets[newId] = { name, code: value };
            showStatus('✓ Snippet saved as custom copy!', 'success');
        } else {
            // Editing existing custom snippet
            snippets[currentEditingId] = { name, code: value };
            showStatus('✓ Updated!', 'success');
        }

        localStorage.setItem(getGlobalStorageKey('customSnippets'), JSON.stringify(snippets));
        loadSnippets();
    } else {
        // Validate variable name
        if (!isValidVariableName(name)) {
            showStatus('Variable name must start with -- or $ and contain only alphanumeric, dash, or underscore characters', 'error');
            return;
        }

        let variables = JSON.parse(localStorage.getItem(getStorageKey('cssVariables')) || '{}');

        // Atomic operation: check for duplicate names first (if name changed)
        if (name !== currentEditingId && name in variables) {
            showStatus('Variable with this name already exists', 'error');
            return;
        }

        // Perform atomic update: delete old and add new in single operation
        const newVariables = {};
        Object.entries(variables).forEach(([key, val]) => {
            if (key !== currentEditingId) {
                newVariables[key] = val;
            }
        });
        newVariables[name] = value;

        localStorage.setItem(getStorageKey('cssVariables'), JSON.stringify(newVariables));
        loadVariables();
        showStatus('✓ Updated!', 'success');
    }

    closeModal();
}

// ===== UTILITY FUNCTIONS =====
function getStorageKey(type) {
    return currentProfile ? `${currentProfile}_${type}` : type;
}

function getGlobalStorageKey(type) {
    return `global_${type}`;
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;

    setTimeout(function() {
        statusEl.className = 'status';
    }, 2500);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function parseVariables(input) {
    const variables = [];
    const lines = input.split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Match SCSS format: $var-name: value;
        let match = line.match(/^\$([a-zA-Z0-9\-_]+)\s*:\s*(.+?)(?:;)?$/);
        if (match) {
            const name = '$' + match[1];
            const value = match[2].trim().replace(/;$/, '');
            if (name && value) {
                variables.push({ name, value });
            }
            return;
        }

        // Match CSS format: --var-name: value;
        match = line.match(/^--([a-zA-Z0-9\-_]+)\s*:\s*(.+?)(?:;)?$/);
        if (match) {
            const name = '--' + match[1];
            const value = match[2].trim().replace(/;$/, '');
            if (name && value) {
                variables.push({ name, value });
            }
            return;
        }
    });

    return variables;
}


function saveMenuState(section, type, view) {
    const state = {
        section: section,
        type: type,
        view: view,
        profile: currentProfile
    };
    localStorage.setItem('menuState', JSON.stringify(state));
}

function restoreMenuState() {
    const state = JSON.parse(localStorage.getItem('menuState') || 'null');

    if (!state || state.profile !== currentProfile) {
        showSection('mainMenu');
        return;
    }

    showSection(state.section);

    // Load data based on the section
    if (state.section === 'snippetsSection') {
        loadSnippets();
        loadFileTypeSnippets();
    } else if (state.section === 'variablesSection') {
        loadVariables();
    }

    if (state.view && state.type) {
        const section = document.getElementById(state.section);
        if (section) {
            const submenuBtn = section.querySelector(`[data-view="${state.view}"]`);
            if (submenuBtn) {
                submenuBtn.click();
            }
        }
    }
}
