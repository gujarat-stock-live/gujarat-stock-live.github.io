// Performance optimized JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navRight = document.querySelector('.nav-right');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navRight.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    if (menuToggle && navRight && menuOverlay) {
        menuToggle.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navRight.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navRight.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // TradingView Widget Configuration
    let tvWidget = null;

    // Initialize the widget
    function initWidget(interval = 'D', chartStyle = '1') {
        // Remove existing widget if it exists
        if (tvWidget) {
            tvWidget.remove();
            tvWidget = null;
        }

        const container = document.getElementById('tradingview_chart');
        if (!container) return;

        // Clear the container
        container.innerHTML = '';

        // Create new widget
        tvWidget = new TradingView.widget({
            "width": "100%",
            "height": 500,
            "symbol": "BSE:GUJTLRM",
            "interval": interval,
            "timezone": "Asia/Kolkata",
            "theme": "light",
            "style": chartStyle,
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": false,
            "container_id": "tradingview_chart",
            "hide_side_toolbar": false,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "studies": [
                "Volume@tv-basicstudies"
            ],
            "show_popup_button": false,
            "popup_width": "1000",
            "popup_height": "650"
        });
    }

    // Function to format numbers with commas and appropriate decimals
    function formatNumber(number, decimals = 2) {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals
        }).format(number);
    }

    // Function to format currency in Indian format with ₹ symbol
    function formatCurrency(number) {
        const value = Math.abs(number);
        if (value >= 10000000) {
            return `₹${formatNumber(value / 10000000, 2)} Cr`;
        } else if (value >= 100000) {
            return `₹${formatNumber(value / 100000, 2)} L`;
        } else {
            return `₹${formatNumber(value, 2)}`;
        }
    }

    // Function to format percentage
    function formatPercentage(number) {
        return `${formatNumber(number, 2)}%`;
    }

    // Function to update statistics with real-time data
    function updateStatistics(symbol = 'BSE:GUJTLRM') {
        // Set initial values
        document.getElementById('market-cap').textContent = '₹2.50 Cr';
        document.getElementById('current-price').textContent = '₹25.50';
        document.getElementById('price-change').textContent = '+0.20 (0.79%)';
        document.getElementById('price-change').className = 'text-success';
        document.getElementById('day-range').textContent = '₹24.80 - ₹26.15';
        document.getElementById('year-range').textContent = '₹20.15 - ₹35.80';
        document.getElementById('volume').textContent = '15,250';
        document.getElementById('avg-volume').textContent = '12,500';
        document.getElementById('open-price').textContent = '₹24.90';
        document.getElementById('prev-close').textContent = '₹25.30';
        document.getElementById('pe-ratio').textContent = '18.25';
        document.getElementById('eps').textContent = '₹1.40';
        document.getElementById('book-value').textContent = '₹15.75';
        document.getElementById('dividend-yield').textContent = '2.50%';

        // Create TradingView Symbol Info Widget
        new TradingView.widget({
            "symbol": symbol,
            "width": "100%",
            "height": 0,
            "interval": "D",
            "timezone": "Asia/Kolkata",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "save_image": false,
            "container_id": "tradingview_mini"
        });
    }

    // Timeframe change handler
    window.changeTimeframe = function(interval) {
        const buttons = document.querySelectorAll('.filter-buttons button[onclick*="changeTimeframe"]');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const currentStyle = document.querySelector('.filter-buttons .chart-type.active') ? 
            document.querySelector('.filter-buttons .chart-type.active').getAttribute('data-style') : 
            '1';
        
        initWidget(interval, currentStyle);
    };

    // Chart type change handler
    window.changeChartType = function(style) {
        const buttons = document.querySelectorAll('.filter-buttons .chart-type');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const currentInterval = document.querySelector('.filter-buttons button[onclick*="changeTimeframe"].active') ? 
            document.querySelector('.filter-buttons button[onclick*="changeTimeframe"].active').getAttribute('data-interval') : 
            'D';
        
        initWidget(currentInterval, style);
    };

    // Initialize widget when page loads
    window.addEventListener('load', function() {
        initWidget();
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('ServiceWorker registered'))
                .catch(err => console.log('ServiceWorker registration failed:', err));
        });
    }
}); 