const { document, console } = require('window-or-global');

function CustomTooltip() {}

CustomTooltip.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    const { displayField, color } = params;
    var data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.eGui.style =
        'padding:12px; position: absolute; width: 450px; height: auto; border: 1px solid #2E31BE; overflow: hidden; pointer-events: none;';
    this.eGui.style['background-color'] = color || 'white';
    this.eGui.innerHTML = data[displayField] || 'Custom Tooltip';
    // if (params.colDef.field === 'delievery_pincode') {
    //     this.eGui.innerHTML = data.address;
    // } else if (params.colDef.field === 'customer_name') {
    //     this.eGui.innerHTML = data.customer_number;
    // }
};

CustomTooltip.prototype.getGui = function() {
    return this.eGui;
};

exports.CustomTooltip = CustomTooltip;
