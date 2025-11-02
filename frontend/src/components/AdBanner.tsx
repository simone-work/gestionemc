import React from 'react';
import { Stack, Text, mergeStyleSets, useTheme, PrimaryButton, type IButtonStyles } from '@fluentui/react';

const AdBanner = () => {
    const theme = useTheme();

    // Stili per il banner e i suoi elementi
    const styles = mergeStyleSets({
        adContainer: {
            width: '100%',
            height: '100%',
            backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                url("https://images.unsplash.com/photo-1512850183-6d7990f42385?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: theme.effects.roundedCorner6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            color: 'white',
            position: 'relative', // 1. Rendiamo il contenitore un punto di riferimento per il posizionamento
        },
        adText: {
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        },
        // 2. Stile per il contenitore del bottone, posizionato in modo assoluto
        adButtonContainer: {
            position: 'absolute',
            bottom: '24px', // Distanza dal fondo
            left: '50%',
            transform: 'translateX(-50%)', // Trucco per centrarlo orizzontalmente
        },
    });

    // Stili specifici per il bottone, per un look "ghost" semi-trasparente
    const adButtonStyles: IButtonStyles = {
        root: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.8)',
            color: 'white',
            backdropFilter: 'blur(5px)', // Effetto vetro smerigliato per il bottone
        },
        rootHovered: {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderColor: 'white',
            color: 'white',
        },
        rootPressed: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'white',
            color: 'white',
        }
    };

    return (
        <div className={styles.adContainer}>
            {/* Contenuto testuale principale (rimane centrato) */}
            <Stack tokens={{ childrenGap: 12 }}>
                <Text variant="large" className={styles.adText}>Spazio Pubblicitario</Text>
                <Text className={styles.adText}>Promuovi il tuo prodotto qui.</Text>
            </Stack>

            {/* Contenitore del bottone posizionato in fondo */}
            <div className={styles.adButtonContainer}>
                {/* Il bottone è avvolto in un tag <a> per renderlo un link esterno */}
                <a href="https://example.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <PrimaryButton
                        text="Scopri di più"
                        styles={adButtonStyles}
                    />
                </a>
            </div>
        </div>
    );
};

export default AdBanner;