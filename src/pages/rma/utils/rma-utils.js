const RMAUtils = {
    foo(){
        console.log('test');
    },
    loadSalesChannels({
        page_size = 5,
        page_no = 1,
        rule_type = 'global'
    }){
        const params = { page_size, page_no, rule_type }
        RMAService.getRulesList(params)
        .then((result) => {
            this.tableData = result.data.items
            this.isListLoaded = true
            this.pagination.total = result.data.page.item_total
        })
    }
}

export default RMAUtils;