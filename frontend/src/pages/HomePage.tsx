import { useSearchParams } from 'react-router-dom';
import { Stack, Image, Text, MessageBar, MessageBarType, Link } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faInstagram, faTiktok} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import Login from '../components/Login';

const HomePage = () => {

    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');

    return (

        <Stack
            style={{
                height: '100vh',
                backgroundColor: '#0f172a'
            }}
        >
            {/* HEADER */}
            <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 20 }}
                style={{
                    backgroundColor: '#1e293b',
                    padding: '10px',
                }}
            >
                <Image
                    src="/mythictales_logo.png"
                    alt="Mythic Tales Logo"
                    width={50}
                    height={50}
                />
                <Text style={{ margin: 0, color: 'white' }} variant='xxLarge'>
                    Mythic Tales
                </Text>
            </Stack>

            {/* CONTENUTO PRINCIPALE */}

            <Stack
                grow={1}
                verticalAlign="center"
                horizontalAlign="center"

            >
                {/* Mostra una barra di errore se l'URL contiene il parametro corretto */}
                {error === 'not_in_server' && (
                    <MessageBar messageBarType={MessageBarType.error}>
                        Accesso negato. Devi essere un membro del nostro server Discord per accedere.
                    </MessageBar>
                )}
                <Login></Login>
            </Stack>

            {/* --- FOOTER --- */}
            <Stack
                as="footer"
                verticalAlign='center'
                horizontalAlign="center"
                tokens={{ childrenGap: 8 }}
                styles={{ root: { padding: '20px', color: 'white', backgroundColor: '#1e293b' } }}
            >
                <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
                    <Link href='https://discord.gg/SS8VkYqsJU' title='Discord' style={{ color: 'white' }}>
                        <FontAwesomeIcon icon={faDiscord} size="1x"  />
                    </Link>
                    <Link href='https://www.instagram.com/mcmythictales/' title='Instagram' style={{ color: 'white' }}>
                        <FontAwesomeIcon icon={faInstagram} size="1x" />
                    </Link>
                    <Link href='https://www.tiktok.com/@mythic_tales?lang=it-IT' title='TikTok' style={{ color: 'white' }}>
                        <FontAwesomeIcon icon={faTiktok} size="1x" />
                    </Link>
                    <Link href='https://wiki.mythictales.it/' title='Wiki' style={{ color: 'white' }}>
                        <FontAwesomeIcon icon={faGlobe} size="1x" />
                    </Link>
                </Stack>
                <Text style={{ color: 'white' }} >© 2025 Mythic Tales. Tutti i diritti riservati.</Text>
            </Stack>

        </Stack>
    );
};
export default HomePage;