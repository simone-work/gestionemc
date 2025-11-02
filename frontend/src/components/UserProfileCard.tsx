import { Persona, PersonaSize, Stack, Text, Icon, useTheme, mergeStyleSets } from '@fluentui/react';
import { useAuth } from '../auth/AuthContext';

const UserProfileCard = () => {
    const { user } = useAuth();
    const theme = useTheme();

    const gameStats = {
        citta: 'Mythic City',
        soldi: '1,250$',
        valutaVirtuale: '50 Gemme'
    };

    const styles = mergeStyleSets({

        // Contenitore principale 
        profileContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '32px',
            gap: '10%',
            boxSizing: 'border-box',
        },

        userInfoSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
        },

        statsSection: {
            padding: '32px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)', 
            borderRadius: theme.effects.roundedCorner6,
        },
        statItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 0',
            borderBottom: `1px solid ${theme.palette.neutralLighter}`,
            selectors: {
                ':last-child': {
                    borderBottom: 'none',
                }
            }
        },
        statIcon: {
            fontSize: '24px',
        },
        statText: {
            fontSize: theme.fonts.large.fontSize,
        }
    });

    if (!user) {
        return <Text>Caricamento dati utente...</Text>;
    }

    return (
        <div className={styles.profileContainer}>

            <div className={styles.userInfoSection}>
                <Persona
                    imageUrl={user.avatarUrl}
                    text={user.username}
                    size={PersonaSize.size120} 
                    hidePersonaDetails
                />
                <Stack>
                    <Text variant="xxLargePlus" styles={{ root: { fontWeight: 600 } }}>{user.username}</Text>
                    <Text variant="large" styles={{ root: { color: theme.palette.neutralSecondary } }}>Giocatore</Text>
                </Stack>
            </div>


            <div className={styles.statsSection}>
                <Stack tokens={{ childrenGap: 16 }}>
                    <Text variant="xLarge" styles={{ root: { fontWeight: 600, marginBottom: '16px' } }}>Statistiche in Gioco</Text>

                    <div className={styles.statItem}>
                        <Icon iconName="Home" styles={{ root: styles.statIcon }} />
                        <Text className={styles.statText}>Città di appartenenza: <strong>{gameStats.citta}</strong></Text>
                    </div>

                    <div className={styles.statItem}>
                        <Icon iconName="Money" styles={{ root: styles.statIcon }} />
                        <Text className={styles.statText}>Soldi: <strong>{gameStats.soldi}</strong></Text>
                    </div>

                    <div className={styles.statItem}>
                        <Icon iconName="Diamond" styles={{ root: styles.statIcon }} />
                        <Text className={styles.statText}>Valuta virtuale: <strong>{gameStats.valutaVirtuale}</strong></Text>
                    </div>
                </Stack>
            </div>
            
        </div>

    );
};
export default UserProfileCard;