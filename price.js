document.addEventListener('DOMContentLoaded', function () {
    new TradingView.widget({
        "container_id": "tradingview_widget",
        "symbol": "BINANCE:BTCUSD",
        "width": "100%",
        "height": "300",
        "locale": "en",
        "dateRange": "1D",
        "colorTheme": "light",
        "trendLineColor": "rgba(41, 98, 255, 1)",
        "underLineColor": "rgba(41, 98, 255, 0.3)",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": ""
    });

    new TradingView.widget({
        "container_id": "tradingview_widget_eth",
        "symbol": "BINANCE:ETHUSD",
        "width": "100%",
        "height": "300",
        "locale": "en",
        "dateRange": "1D",
        "colorTheme": "light",
        "trendLineColor": "rgba(41, 98, 255, 1)",
        "underLineColor": "rgba(41, 98, 255, 0.3)",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": ""
    });
});
