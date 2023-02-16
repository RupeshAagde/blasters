const getCheckboxComponent = (id, text, value, lineItems = undefined, additionalParams = undefined) => {
    return {
        id: id,
        type: 'checkbox',
        text: text,
        data: {
            isSelected: value,
            currentValue: value,
            lineItems: lineItems,
        },
        additionalParams
    };

}
const getButtonComponent = (id, text, lineItems = undefined, additionalParams = undefined) => {
    return {
        id: id,
        type: 'button',
        text: text,
        data: {
            currentValue: true,
            lineItems: lineItems,
        },
        additionalParams
    };
}
const getDropDownComponent = (id, text, value, lineItems = undefined, additionalParams = undefined) => {
    return {
        id: id,
        type: 'dropdown',
        text: text,
        data: {
            // isSelected: value,
            currentValue: value,
            lineItems: lineItems,
        },
        additionalParams
    };
}
const getToggleComponent = (id, text, value, lineItems = undefined, additionalParams = undefined) => {
    return {
        id: id,
        type: 'toggle',
        text: text,
        data: {
            isSelected: value,
            currentValue: value,
            lineItems: lineItems,
        },
        additionalParams
    };
}

const getGroupComponent = (id, text, lineItems = undefined, additionalParams = undefined) => {
    return {
        id: id,
        type: 'group',
        text: text,
        data: {
            currentValue: true,
            lineItems: lineItems,
        },
        additionalParams
    };
}

const getRadioComponent = (id, text, lineItems = undefined) => {
    return {
        id: id,
        type: 'radio',
        text: text,
        data: {
            lineItems: lineItems
        },
    };
}

const getRadioGroup = (id, text, value, lineItems) => {
    return {
        type: 'radio_group',
        id: id,
        text: text,
        data: {
            currentValue: value,
            lineItems: lineItems
        }

    }
}

const getBadge = (id, text) => {
    return {
        type: 'badge',
        id: id,
        text: text
    }
}

const getRangeComponent = (id, text, from, to, additionalParams = undefined) => {
    return {
        id: id,
        type: 'range',
        text: text,
        data: {
            from: from,
            to: to
        },
        additionalParams
    };
}

export { getDropDownComponent, getButtonComponent, getCheckboxComponent, getToggleComponent, getRadioComponent, getRadioGroup, getGroupComponent, getBadge, getRangeComponent }
