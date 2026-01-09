export function createCustomHtmlNotificationHTML() {
  return `
      <div id="custom-html-notification" style="
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      ">
        <span>⚠️ Custom HTML saved. Will be used when exporting. 
        <a href="#" id="clear-custom-html" style="color: #856404; text-decoration: underline; margin-left: 8px;">Clear and return to editing blocks</a></span>
      </div>
  `;
}


