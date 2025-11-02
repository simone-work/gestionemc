import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
    Persona, 
    PersonaSize, 
    ContextualMenu, 
    type IContextualMenuItem, 
    DirectionalHint,
    type IContextualMenuStyles, // Importiamo il tipo per lo stile del menu
    Text
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isMenuVisible, { toggle: toggleIsMenuVisible, setFalse: hideMenu }] = useBoolean(false);
    const menuButtonRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        navigate('/');
        logout();
    };

    // Definiamo le voci del menu. Ora non hanno più bisogno di stili individuali.
    const menuItems: IContextualMenuItem[] = [
        {
            key: 'logout',
            text: 'Logout',
            iconProps: { iconName: 'SignOut' },
            onClick: () => {
                handleLogout();
                hideMenu();
            },
        },
    ];

// 1. Definiamo lo stile per il contenitore del menu e i suoi sotto-componenti.
    const contextualMenuStyles: Partial<IContextualMenuStyles> = {
        // Stile per il contenitore principale del menu
        root: {
            backgroundColor: 'white',
        },
        // La chiave 'subComponentStyles' ci permette di stilizzare i figli.
        subComponentStyles: {
            // Qui definiamo gli stili per ogni 'menuItem'.
            menuItem: {
                // Stile per il contenitore di ogni singola voce
                root: {
                    color: 'black', // Colore del testo
                },
                rootHovered: {
                    backgroundColor: '#f3f2f1', // Sfondo per l'hover
                    color: 'black',
                },
                // Stile per l'icona all'interno della voce
                icon: {
                    color: 'black', // Forza l'icona a essere nera
                },
                iconHovered: {
                    color: 'black', // Anche in stato di hover
                },
            },

            callout: {}
        },
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div ref={menuButtonRef} onClick={toggleIsMenuVisible} style={{ cursor: 'pointer' }}>
                <Persona
                    imageUrl={user.avatarUrl}
                    text={user.username}
                    size={PersonaSize.size40}
                    hidePersonaDetails={true}
                />
            </div>

            {/* 2. Applichiamo l'oggetto di stile direttamente al componente ContextualMenu */}
            <ContextualMenu
                items={menuItems}
                hidden={!isMenuVisible}
                target={menuButtonRef}
                onItemClick={hideMenu}
                onDismiss={hideMenu}
                directionalHint={DirectionalHint.bottomRightEdge}
                styles={contextualMenuStyles}
            />
        </>
    );
};

export default UserMenu;