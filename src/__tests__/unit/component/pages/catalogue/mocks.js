export default {
    "departments": [{
        "created_by": {
            "username": "app@fynd.com",
            "user_id": "0"
        },
        "priority_order": 100,
        "slug": "electronics",
        "uid": 1,
        "modified_by": {
            "username": "918793638893_86554",
            "user_id": "3"
        },
        "modified_on": "2020-08-06T18:07:09.974000+00:00",
        "created_on": "2020-05-18T16:14:41.689000+00:00",
        "logo": "https://hdn-1.addsale.com/x0/platform/pictures/free-logo/original/_G1Z2Fg1L-http:d3p8ifzkmzds37.cloudfront.netmedialogodepartmentoriginal15870_c287d3c2431a432bb0e49363ef6b82bc.png.png",
        "synonyms": [],
        "is_active": true,
        "name": "Electronics"
    }],
    variants: [{
        "display": "Additional Colors", "priority": 1, "uid": 2,
        "departments": ["men", "electronics"], "modified_on": "2020-08-18T05:14:35.519000Z",
        "is_active": true, "created_by": { "user_id": "0", "username": "tergeo" },
        "display_type": "image", "created_on": "2019-06-08T04:34:16.736000Z",
        "modified_by": { "user_id": "0", "username": "silverbolt" }, "key": "color"
    }],
    choicesResponse: {
        "data": [{ "key": "text", "value": "Text" },
        { "key": "image", "value": "Image" },
        { "key": "color", "value": "Color" }],
        "type": "variants"
    },
    attributeMasterResponse: {
        "data": [{
            "meta": { "enriched": false, "mandatory_details": { "l3_keys": [] } },
            "departments": ["electronics"], "enabled_for_end_consumer": true, "description": "", "tags": [],
            "schema": { "multi": false, "range": {}, "mandatory": false, "enum": [], "type": "str" },
            "details": { "displayType": "details" }, "filters": { "depends_on": [], "indexing": false },
            "slug": "services", "is_nested": true, "synonyms": {}, "name": "services", "id": "5ef2472e0087fa001ce990bb"
        },
        {
            "meta": { "mandatory_details": { "l3_keys": [] }, "enriched": false }, "departments": ["electronics"],
            "enabled_for_end_consumer": true, "description": "", "tags": [],
            "schema": { "mandatory": false, "multi": false, "format": "", "type": "str" },
            "details": { "displayType": "details" }, "filters": { "indexing": true },
            "slug": "selfie_camera_filter", "is_nested": true, "synonyms": {},
            "name": "Selfie Camera (Duplicate)", "unit": "", "id": "5ef2472e0087fa001ce990bc"
        },
        {
            "meta": { "enriched": false, "mandatory_details": { "l3_keys": [] } }, "departments": ["electronics"],
            "enabled_for_end_consumer": true, "description": "", "tags": [], "schema": {
                "multi": false, "range": {},
                "mandatory": false, "enum": [], "type": "str"
            }, "details": { "displayType": "details" },
            "filters": { "depends_on": [], "indexing": true, "priority": 3 }, "slug": "screen_size_filter",
            "is_nested": true, "synonyms": {}, "name": "Screen Size", "id": "5ef2472e0087fa001ce990bd"
        },
        {
            "meta": { "enriched": false, "mandatory_details": { "l3_keys": [] } },
            "departments": ["men", "women", "toys", "kids", "baby-care-kids-essentials",
                "beauty-personal-care", "home-living", "Industrial Supplies"], "enabled_for_end_consumer": true,
            "description": "", "tags": [], "schema": {
                "multi": false, "range": {},
                "mandatory": false, "enum": [], "type": "str"
            }, "details": { "displayType": "details" },
            "filters": { "depends_on": [], "indexing": false }, "slug": "brand_rating", "is_nested": true, "synonyms": {},
            "name": "ratings", "id": "5ef2472e0087fa001ce990be"
        },],
        "page": { "current": 1, "next": 2, "has_next": true, "total_count": 228 }
    }
}