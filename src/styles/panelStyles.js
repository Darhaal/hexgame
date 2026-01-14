export const PANEL_STYLES = {
    // Внешний контейнер (Темный металл/пластик)
    frame: {
        pointerEvents: 'auto',
        backgroundColor: '#2F3532',
        border: '2px solid #1a1e1c',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
        borderRadius: '4px',
        display: 'flex', flexDirection: 'column', padding: '6px',
        position: 'absolute',
        boxSizing: 'border-box',
        fontFamily: "'Courier New', monospace",
        overflow: 'hidden'
    },

    // Шапка окна
    header: {
        height: '32px',
        backgroundColor: '#222624',
        borderBottom: '1px solid #1a1e1c',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 10px',
        cursor: 'grab',
        userSelect: 'none',
        marginBottom: '4px',
        color: '#8c9c95'
    },

    headerTitle: {
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },

    closeBtn: {
        background: 'none', border: 'none',
        color: '#ef5350', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', padding: '0',
        transition: 'opacity 0.2s'
    },

    // Внутренняя область (Бумага)
    contentPaper: {
        flex: 1,
        backgroundColor: '#f4f1ea', // Теплый бумажный оттенок
        // Шум бумаги (опционально)
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        border: '1px solid #8d6e63',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        color: '#3e2723'
    },

    // Ручка ресайза
    resizeHandle: {
        position: 'absolute', bottom: '2px', right: '2px',
        width: '15px', height: '15px',
        cursor: 'nwse-resize',
        background: 'linear-gradient(135deg, transparent 50%, #5d6d65 50%)',
        zIndex: 50
    }
};