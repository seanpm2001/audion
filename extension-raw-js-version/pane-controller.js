/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Controls logic for the pane.
 * @constructor
 */
var PaneController = function() {
  /**
   * A function (if any) to call whenever the pane's close button is clicked.
   * @type {?Function}
   */
  this.onPaneClose_ = null;
  var self = this;
  document.querySelector('#pane .closeButton').addEventListener('click',
      function() {
        if (self.onPaneClose_) {
          self.onPaneClose_();
        }
      });
};


/**
 * Sets a function to call whenever the pane's close button is clicked. Set to
 * null for no such function.
 * @param {?Function} onPaneClose The function. Or null for none.
 */
PaneController.prototype.setOnPaneCloseFunction = function(onPaneClose) {
  this.onPaneClose_ = onPaneClose;
};


/**
 * Hides the pane.
 */
PaneController.prototype.hidePane = function() {
  document.getElementById('paneContent').innerHTML = '';
  document.getElementById('pane').classList.add('hidden');
};


/**
 * Makes the pane highlight an AudioNode.
 * @param {!AudioNodeData} audioNodeData The data on an AudioNode to highlight.
 */
PaneController.prototype.highlightAudioNode = function(audioNodeData) {
  var paneTitle = document.querySelector('#pane h1');
  paneTitle.innerHTML = audioNodeData.type + ' ' + audioNodeData.audioNodeId;

  // Note where the node was created if we can detect that.
  var paneContent = document.getElementById('paneContent');
  paneContent.innerHTML = '';
  var creationLineNumber = parseInt(audioNodeData.creationLineNumber);
  if (audioNodeData.creationUrl && creationLineNumber >= 0) {
    var createdAtSection = document.createElement('div');
    createdAtSection.innerHTML = 'Created at ';
    var linkToSource = document.createElement('a');
    linkToSource.setAttribute('href', '#');
    linkToSource.innerHTML = audioNodeData.creationUrl + ':' +
        audioNodeData.creationLineNumber;
    linkToSource.addEventListener('click', function(event) {
      event.preventDefault();
      chrome.devtools.panels.openResource(
          audioNodeData.creationUrl, creationLineNumber);
      return false;
    });
    createdAtSection.appendChild(linkToSource);
    paneContent.appendChild(createdAtSection);
  }

  // Make the pane shown.
  document.getElementById('pane').classList.remove('hidden');
};
