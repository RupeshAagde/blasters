<template>
    <div class="inline-html" v-html="content"></div>
</template>

<script>
module.exports = {
    data: function data() {
        return {};
    },
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    methods: {},
    computed: {},
    mounted: function mounted() {
        //console.log("Component Mounted");
    },
    destroyed: function destroyed() {
        //console.log("Component Destroyed");
    }
};
</script>

<style lang="less" scoped>
/**
 * Unreset CSS
 *
 * Copyright (C) 2016 Kite (ixkaito@gmail.com)
 * License MIT
 * Version 1.0.0
 *
 * Unreset CSS restores browsers' default element styles which are reset by
 * Eric Meyer's Reset CSS, YUI 3 Reset CSS, HTML5 Reset Stylesheet of HTML5
 * Doctor, or Tim Murtaugh's HTML5 Reset.
 */

/deep/html {
    box-sizing: content-box;
}

/deep/body {
    margin: 8px;
    line-height: normal;
}

/deep/p {
    margin: 1em 0;
}
/deep/strong {
    font-weight: bold;
}

/deep/blockquote,
figure {
    margin: 1em 40px;
}

/deep/q {
    quotes: '“' '”' '‘' '’';

    &:before {
        content: open-quote;
    }

    &:after {
        content: close-quote;
    }
}

/deep/hr {
    border: 1px inset;
    box-sizing: border-box;
    margin: 0.5em autl;
}

/deep/h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
}

/deep/h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.83em 0;
}

/deep/h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin: 1em 0;
}

/deep/h4 {
    font-size: 1em;
    font-weight: bold;
    margin: 1.33em 0;
}

/deep/h5 {
    font-size: 0.83em;
    font-weight: bold;
    margin: 1.67em 0;
}

/deep/h6 {
    font-size: 0.67em;
    font-weight: bold;
    margin: 2.33em 0;
}

/deep/article,
aside,
nav,
section {
    h1 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.83em 0;
    }

    article,
    aside,
    nav,
    section {
        h1 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 1em 0;
        }

        article,
        aside,
        nav,
        section {
            h1 {
                font-size: 1em;
                font-weight: bold;
                margin: 1.33em 0;
            }

            article,
            aside,
            nav,
            section {
                h1 {
                    font-size: 0.83em;
                    font-weight: bold;
                    margin: 1.67em 0;
                }

                article,
                aside,
                nav,
                section {
                    h1 {
                        font-size: 0.67em;
                        font-weight: bold;
                        margin: 2.33em 0;
                    }
                }
            }
        }
    }
}

/deep/table {
    border-collapse: separate;
    border-spacing: 2px;
    border-color: gray;
}

/deep/thead,
tbody,
tfoot,
tr {
    border-color: inherit;
    vertical-align: middle;
}

/deep/td,
th {
    padding: 1px;
    vertical-align: inherit;
}

/deep/th {
    font-weight: bold;
}

/deep/caption {
    text-align: center;
}

/deep/ul,
menu {
    list-style-type: disc;
    margin: 1em 0;
    padding: 0 0 0 40px;
}

/deep/ol {
    list-style-type: decimal;
    margin: 1em 0;
    padding: 0 0 0 40px;
}

/deep/ul,
ol {
    ul {
        list-style-type: circle;
    }

    ul,
    ol {
        ul {
            list-style-type: square;
        }
    }
}

/deep/dd {
    margin: 0 0 0 40px;
}

/deep/dl {
    margin: 1em 0;
}

/deep/ul,
ol,
menu,
dl {
    ul,
    ol,
    menu,
    dl {
        margin: 0;
    }
}

/deep/legend {
    padding: 0 2px;
}

/deep/fieldset {
    border-style: groove;
    border-width: 2px;
    border: 2px groove ThreeDFace;
    margin: 0 2px;
    padding: 0 2px 3px;
    -webkit-padding-before: 0.35em;
    -webkit-padding-start: 0.75em;
    -webkit-padding-end: 0.75em;
    -webkit-padding-after: 0.625em;
}

/deep/ins {
    background-color: transparent;
    font-weight: inherit;
    text-decoration: underline;
}

/deep/b,
strong {
    font-weight: bold;
}

/deep/i,
cite,
em,
var,
address,
dfn {
    font-style: italic;
    font-weight: inherit;
}

/deep/abbr[title],
dfn[title] {
    border-bottom: 0;
    cursor: default;
    font-weight: inherit;
}

/deep/tt,
code,
kbd,
samp {
    font-family: monospace;
    font-weight: inherit;
}

/deep/pre {
    font-family: monospace;
    margin: 1em 0;
    white-space: pre;
}

/deep/mark {
    background-color: yellow;
    color: black;
    font-style: normal;
    font-weight: inherit;
}

/deep/big {
    font-size: larger;
    font-weight: inherit;
}

/deep/small {
    font-size: smaller;
    font-weight: inherit;
}

/deep/sub,
sup {
    font-weight: inherit;
    line-height: inherit;
    position: static;
}

/deep/sub {
    font-size: smaller;
    bottom: 0;
    vertical-align: sub;
}

/deep/sup {
    font-size: smaller;
    top: 0;
    vertical-align: super;
}

/deep/ruby {
    > rt {
        font-size: 50%;
    }
}

/deep/iframe {
    border: 2px inset;
}
</style>
