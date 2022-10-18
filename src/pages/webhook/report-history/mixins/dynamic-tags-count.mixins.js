const dynamicTagsCountMixins = {
    methods: {
        calculateTagsOrientation(extraOffset = 0) {
            const tags = this.$refs['dynamic-tags'];
            if (!tags){
                return 0;
            }
            let totalOverFlowingElements = [];
            const parentContainer = tags[0].parentElement;
            const parentLength = parentContainer.clientWidth;
            tags.forEach(tag => {
                const offsetLeft = tag.offsetLeft + extraOffset;
                if (offsetLeft > parentLength) {
                    totalOverFlowingElements.push(tag);
                }
            })
            return totalOverFlowingElements.length;
        }
    }
};
export {dynamicTagsCountMixins}