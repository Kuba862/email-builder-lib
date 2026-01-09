export function createEmailPreviewModalHTML() {
  return `
    <!-- Email Preview Modal -->
    <div class="modal-overlay" id="email-preview-modal" style="display: none;">
      <div class="modal-content" style="max-width: 95%; width: 1200px; height: 95vh;">
        <div class="modal-header">
          <h2>Email Preview</h2>
          <button class="modal-close" id="btn-preview-close">×</button>
        </div>
        
        <!-- Preview Controls -->
        <div class="preview-controls" style="padding: 15px; border-bottom: 1px solid #ddd; background: #f8f8f8;">
          <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
            <!-- Browser Selector -->
            <div class="preview-control-group">
              <label style="font-weight: bold; margin-right: 8px;">Browser:</label>
              <select id="preview-browser" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
                <option value="safari">Safari</option>
                <option value="edge">Edge</option>
              </select>
            </div>

            <!-- Device Selector -->
            <div class="preview-control-group">
              <label style="font-weight: bold; margin-right: 8px;">Device:</label>
              <select id="preview-device" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; min-width: 200px;">
                <optgroup label="Desktop">
                  <option value="desktop">Desktop</option>
                </optgroup>
                <optgroup label="Tablets">
                  <option value="ipad">iPad</option>
                  <option value="ipadPro">iPad Pro</option>
                  <option value="ipadAir">iPad Air</option>
                  <option value="galaxyTab">Galaxy Tab</option>
                </optgroup>
                <optgroup label="iPhone">
                  <option value="iphoneSE">iPhone SE</option>
                  <option value="iphone8">iPhone 8</option>
                  <option value="iphone8Plus">iPhone 8 Plus</option>
                  <option value="iphoneX">iPhone X</option>
                  <option value="iphone11">iPhone 11</option>
                  <option value="iphone11Pro">iPhone 11 Pro</option>
                  <option value="iphone11ProMax">iPhone 11 Pro Max</option>
                  <option value="iphone12">iPhone 12</option>
                  <option value="iphone12Pro">iPhone 12 Pro</option>
                  <option value="iphone12ProMax">iPhone 12 Pro Max</option>
                  <option value="iphone13">iPhone 13</option>
                  <option value="iphone13Pro">iPhone 13 Pro</option>
                  <option value="iphone13ProMax">iPhone 13 Pro Max</option>
                  <option value="iphone14">iPhone 14</option>
                  <option value="iphone14Pro">iPhone 14 Pro</option>
                  <option value="iphone14ProMax">iPhone 14 Pro Max</option>
                  <option value="iphone15">iPhone 15</option>
                  <option value="iphone15Pro">iPhone 15 Pro</option>
                  <option value="iphone15ProMax">iPhone 15 Pro Max</option>
                </optgroup>
                <optgroup label="Android">
                  <option value="pixel">Google Pixel</option>
                  <option value="pixelXL">Google Pixel XL</option>
                  <option value="pixel2">Google Pixel 2</option>
                  <option value="pixel2XL">Google Pixel 2 XL</option>
                  <option value="pixel3">Google Pixel 3</option>
                  <option value="pixel3XL">Google Pixel 3 XL</option>
                  <option value="pixel4">Google Pixel 4</option>
                  <option value="pixel4XL">Google Pixel 4 XL</option>
                  <option value="pixel5">Google Pixel 5</option>
                  <option value="pixel6">Google Pixel 6</option>
                  <option value="pixel6Pro">Google Pixel 6 Pro</option>
                  <option value="pixel7">Google Pixel 7</option>
                  <option value="pixel7Pro">Google Pixel 7 Pro</option>
                  <option value="pixel8">Google Pixel 8</option>
                  <option value="pixel8Pro">Google Pixel 8 Pro</option>
                  <option value="galaxyS20">Galaxy S20</option>
                  <option value="galaxyS21">Galaxy S21</option>
                  <option value="galaxyS22">Galaxy S22</option>
                  <option value="galaxyS23">Galaxy S23</option>
                  <option value="galaxyNote20">Galaxy Note 20</option>
                </optgroup>
              </select>
            </div>

            <!-- Email Client Selector -->
            <div class="preview-control-group">
              <label style="font-weight: bold; margin-right: 8px;">Email Client:</label>
              <select id="preview-client" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="apple">Apple Mail</option>
                <option value="yahoo">Yahoo Mail</option>
                <option value="default">Default</option>
              </select>
            </div>

            <!-- Refresh Button -->
            <button id="btn-preview-refresh" class="header-btn" style="margin-left: auto;">
              🔄 Refresh
            </button>
          </div>
        </div>

        <!-- Preview Container -->
        <div class="modal-body" style="height: calc(95vh - 200px); overflow: auto; padding: 20px; background: #e5e5e5; display: flex; justify-content: center; align-items: flex-start;">
          <div id="email-preview-container" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <iframe id="email-preview-iframe" style="width: 100%; height: 100%; border: none;"></iframe>
            <div id="email-preview-content" style="display: none;"></div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn" id="btn-preview-close-footer">Close</button>
        </div>
      </div>
    </div>
  `;
}

