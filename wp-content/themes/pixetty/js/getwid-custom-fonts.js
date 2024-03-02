(function ($) {
    wp.hooks.addFilter('getwid.fontsControl.fonts', 'getwid', function (fonts) {
        fonts.push({
            id: 'pixetty-fonts',
            title: 'Pixetty Custom Fonts',
            items: [
                {
                    "family": "New York",
                    "variants": [
                        "regular",
                    ]
                }
            ]
        });

        return fonts;
    });
})(jQuery);