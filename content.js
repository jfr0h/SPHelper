(function() {
    'use strict';

    // Default settings
    var ideSettings = {
        invertValue: 1,
        expandedSize: 600,
        shrunkFlex: 1,
        expandedFlex: 3
    };

    // Load settings from extension storage
    chrome.storage.local.get(['ideSettings'], function(result) {
        if (result.ideSettings) {
            ideSettings = result.ideSettings;
        }
        applyIDEStyles();
    });

    function applyIDEStyles() {
        // Remove old style if it exists
        var oldStyle = document.getElementById('sphHelper-ide-styles');
        if (oldStyle) oldStyle.remove();

        // Inject CSS with current settings
        var style = document.createElement('style');
        style.id = 'sphHelper-ide-styles';
        style.textContent = `
            .CodeMirror {
                filter: invert(${ideSettings.invertValue}) !important;
            }
        `;
        document.head.appendChild(style);
    }

    console.log('ServiceNow Widget Editor extension loaded');

    // Handle click to expand columns
    document.addEventListener('click', function(e) {
        var cm = e.target.closest('.CodeMirror');
        if (!cm) return;

        var container = cm.closest('[ng-repeat*="section"]');

        if (container) {
            document.querySelectorAll('[ng-repeat*="section"]').forEach(function(c) {
                c.style.flex = ideSettings.shrunkFlex + ' 1 auto';
            });

            container.style.flex = ideSettings.expandedFlex + ' 1 auto';
            container.style.minHeight = ideSettings.expandedSize + 'px';
        }
    }, true);

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'injectCode') {
            var editorType = request.editorType; // 'client', 'server', 'html', 'css'
            var code = request.code;

            injectCodeIntoEditor(editorType, code);
            sendResponse({status: 'Code injected'});
        } else if (request.action === 'updateIDESettings') {
            // Update settings from popup
            ideSettings = request.settings;
            applyIDEStyles();
            sendResponse({status: 'Settings updated'});
        }
    });
    
    function injectCodeIntoEditor(editorType, code) {
        // Find the right editor based on type
        var editors = document.querySelectorAll('[ng-repeat*="section"]');
        var targetEditor = null;
        
        editors.forEach(function(editor) {
            var label = editor.textContent;
            
            if (editorType === 'client' && label.includes('Client Script')) {
                targetEditor = editor;
            } else if (editorType === 'server' && label.includes('Server Script')) {
                targetEditor = editor;
            } else if (editorType === 'html' && label.includes('HTML')) {
                targetEditor = editor;
            } else if (editorType === 'css' && label.includes('CSS')) {
                targetEditor = editor;
            }
        });
        
        if (!targetEditor) {
            console.log('Could not find editor for type:', editorType);
            return;
        }
        
        // Get the CodeMirror instance
        var cm = targetEditor.querySelector('.CodeMirror');
        if (!cm || !cm.CodeMirror) {
            console.log('CodeMirror instance not found');
            return;
        }
        
        // Inject the code
        var editor = cm.CodeMirror;
        editor.setValue(code);
        
        console.log('Code injected into', editorType, 'editor');
    }
})();
