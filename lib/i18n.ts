// Simple internationalization system

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';

export interface Translations {
    common: {
        loading: string;
        error: string;
        success: string;
        cancel: string;
        save: string;
        edit: string;
        delete: string;
        view: string;
        back: string;
        search: string;
        filter: string;
        clear: string;
        submit: string;
        close: string;
        markAllAsRead: string;
        markingAsRead: string;
        noNotifications: string;
        allCaughtUp: string;
        noMoreNotifications: string;
        viewDetails: string;
        // 404 page
        somethingsMissing: string;
        pageNotFound: string;
        backToHomepage: string;
        // Pagination
        previous: string;
        next: string;
        // Common form labels  
        age: string;
        status: string;
        type: string;
        name: string;
        description: string;
        // Common actions
        create: string;
        update: string;
        remove: string;
        approve: string;
        reject: string;
        complete: string;
    };
    sidebar: {
        navigation: string;
        expand: string;
        collapse: string;
        yourTeams: string;
    };
    organizations: {
        galacticFactions: string;
        majorPoliticalMilitary: string;
        createFaction: string;
        noFactions: string;
        noFactionsCreated: string;
        leader: string;
        vacant: string;
        members: string;
        member: string;
        direct: string;
        active: string;
        inactive: string;
        suborganizations: string;
        suborganization: string;
    };
    notifications: {
        viewNotifications: string;
    };
    header: {
        openMainMenu: string;
        openCharacterMenu: string;
        openUserMenu: string;
        more: string;
        administration: string;
        userAdministration: string;
        calendarSettings: string;
        notificationsTest: string;
        profile: string;
        settings: string;
        login: string;
        logout: string;
        home: string;
        characters: string;
        organizations: string;
        documents: string;
        inventory: string;
    };
    breadcrumb: {
        editing: string;
        viewing: string;
        creating: string;
        character: string;
        organization: string;
        pending: string;
    };
    navigation: {
        home: string;
        characters: string;
        organizations: string;
        documents: string;
        inventory: string;
        calendar: string;
        notifications: string;
        profile: string;
        settings: string;
        admin: string;
    };
    documents: {
        gameDocuments: string;
        organizationDocuments: string;
        personalDocuments: string;
        gameDocumentsDescription: string;
        organizationDocumentsDescription: string;
        personalDocumentsDescription: string;
        filterByOrganization: string;
        allOrganizations: string;
        addDocument: string;
        documentId: string;
        title: string;
        author: string;
        date: string;
        status: string;
        access: string;
        restricted: string;
        clearanceRequired: string;
        accessRestricted: string;
        document: string;
        documentType: string;
        creationDate: string;
        organization: string;
        assignees: string;
        content: string;
        signedBy: string;
    };
    time: {
        justNow: string;
        minutesAgo: string;
        hoursAgo: string;
        daysAgo: string;
        weeksAgo: string;
        monthsAgo: string;
        yearsAgo: string;
    };
}

const translations: Record<SupportedLanguage, Translations> = {
    en: {
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            edit: 'Edit',
            delete: 'Delete',
            view: 'View',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            search: 'Search',
            filter: 'Filter',
            clear: 'Clear',
            submit: 'Submit',
            close: 'Close',
            markAllAsRead: 'Mark all as read',
            markingAsRead: 'Marking as read...',
            noNotifications: 'No notifications',
            allCaughtUp: "You're all caught up!",
            noMoreNotifications: 'No more notifications',
            viewDetails: 'View details →',
            // 404 page
            somethingsMissing: 'Something\'s missing.',
            pageNotFound: 'Sorry, we can\'t find that page. You\'ll find lots to explore on the home page.',
            backToHomepage: 'Back to Homepage',
            // Common form labels
            age: 'Age',
            status: 'Status',
            type: 'Type',
            name: 'Name',
            description: 'Description',
            // Common actions
            create: 'Create',
            update: 'Update',
            remove: 'Remove',
            approve: 'Approve',
            reject: 'Reject',
            complete: 'Complete',
        },
        sidebar: {
            navigation: 'Navigation',
            expand: 'Expand',
            collapse: 'Collapse',
            yourTeams: 'Your teams',
        },
        navigation: {
            home: 'Home',
            characters: 'Characters',
            organizations: 'Organizations',
            documents: 'Documents',
            inventory: 'Inventory',
            calendar: 'Calendar',
            notifications: 'Notifications',
            profile: 'Profile',
            settings: 'Settings',
            admin: 'Administration',
        },
        time: {
            justNow: 'just now',
            minutesAgo: 'minutes ago',
            hoursAgo: 'hours ago',
            daysAgo: 'days ago',
            weeksAgo: 'weeks ago',
            monthsAgo: 'months ago',
            yearsAgo: 'years ago',
        },
        organizations: {
            galacticFactions: 'Galactic Factions',
            majorPoliticalMilitary: 'Major political and military organizations across the galaxy',
            createFaction: 'Create Faction',
            noFactions: 'No factions',
            noFactionsCreated: 'No factions have been created yet.',
            leader: 'Leader',
            vacant: 'Vacant',
            members: 'Members',
            member: 'Member',
            direct: 'direct',
            active: 'Active',
            inactive: 'Inactive',
            suborganizations: 'Suborganizations',
            suborganization: 'Suborganization',
        },
        notifications: {
            viewNotifications: 'View notifications',
        },
        header: {
            openMainMenu: 'Open main menu',
            openCharacterMenu: 'Open character menu',
            openUserMenu: 'Open user menu',
            more: 'More',
            administration: 'Administration',
            userAdministration: 'User Administration',
            calendarSettings: 'Calendar Settings',
            notificationsTest: 'Notifications Test',
            profile: 'Profile',
            settings: 'Settings',
            login: 'Login',
            logout: 'Logout',
            home: 'Home',
            characters: 'Characters',
            organizations: 'Organizations',
            documents: 'Documents',
            inventory: 'Inventory',
        },
        breadcrumb: {
            editing: 'Editing:',
            viewing: 'Viewing:',
            creating: 'Creating',
            character: 'Character',
            organization: 'Organization',
            pending: 'Pending',
        },
        documents: {
            gameDocuments: 'Game Documents',
            organizationDocuments: 'Organization Documents',
            personalDocuments: 'Personal Documents',
            gameDocumentsDescription: 'A list of documents related to EOTIR related rulings.',
            organizationDocumentsDescription: 'A list of documents related to specific organizations.',
            personalDocumentsDescription: 'A list of personal notes and documents.',
            filterByOrganization: 'Filter by Organization:',
            allOrganizations: 'All Organizations',
            addDocument: 'Add Document',
            documentId: 'Document ID',
            title: 'Title',
            author: 'Author',
            date: 'Date',
            status: 'Status',
            access: 'Access',
            restricted: 'Restricted',
            clearanceRequired: 'Clearance Required',
            accessRestricted: 'Access Restricted',
            document: 'Document',
            documentType: 'Document Type',
            creationDate: 'Creation Date',
            organization: 'Organization',
            assignees: 'Assignees',
            content: 'Content',
            signedBy: 'Signed By',
        },
    },
    es: {
        common: {
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            cancel: 'Cancelar',
            save: 'Guardar',
            edit: 'Editar',
            delete: 'Eliminar',
            view: 'Ver',
            back: 'Atrás',
            next: 'Siguiente',
            previous: 'Anterior',
            search: 'Buscar',
            filter: 'Filtrar',
            clear: 'Limpiar',
            submit: 'Enviar',
            close: 'Cerrar',
            markAllAsRead: 'Marcar todo como leído',
            markingAsRead: 'Marcando como leído...',
            noNotifications: 'Sin notificaciones',
            allCaughtUp: '¡Estás al día!',
            noMoreNotifications: 'No hay más notificaciones',
            viewDetails: 'Ver detalles →',
            // 404 page
            somethingsMissing: 'Algo falta.',
            pageNotFound: 'Lo sentimos, no podemos encontrar esa página. Encontrarás mucho que explorar en la página de inicio.',
            backToHomepage: 'Volver al Inicio',
            // Common form labels
            age: 'Edad',
            status: 'Estado',
            type: 'Tipo',
            name: 'Nombre',
            description: 'Descripción',
            // Common actions
            create: 'Crear',
            update: 'Actualizar',
            remove: 'Eliminar',
            approve: 'Aprobar',
            reject: 'Rechazar',
            complete: 'Completar',
        },
        sidebar: {
            navigation: 'Navegación',
            expand: 'Expandir',
            collapse: 'Colapsar',
            yourTeams: 'Tus equipos',
        },
        navigation: {
            home: 'Inicio',
            characters: 'Personajes',
            organizations: 'Organizaciones',
            documents: 'Documentos',
            inventory: 'Inventario',
            calendar: 'Calendario',
            notifications: 'Notificaciones',
            profile: 'Perfil',
            settings: 'Configuración',
            admin: 'Administración',
        },
        time: {
            justNow: 'ahora mismo',
            minutesAgo: 'minutos atrás',
            hoursAgo: 'horas atrás',
            daysAgo: 'días atrás',
            weeksAgo: 'semanas atrás',
            monthsAgo: 'meses atrás',
            yearsAgo: 'años atrás',
        },
        organizations: {
            galacticFactions: 'Facciones Galácticas',
            majorPoliticalMilitary: 'Principales organizaciones políticas y militares de la galaxia',
            createFaction: 'Crear Facción',
            noFactions: 'Sin facciones',
            noFactionsCreated: 'Aún no se han creado facciones.',
            leader: 'Líder',
            vacant: 'Vacante',
            members: 'Miembros',
            member: 'Miembro',
            direct: 'directo',
            active: 'Activo',
            inactive: 'Inactivo',
            suborganizations: 'Suborganizaciones',
            suborganization: 'Suborganización',
        },
        notifications: {
            viewNotifications: 'Ver notificaciones',
        },
        header: {
            openMainMenu: 'Abrir menú principal',
            openCharacterMenu: 'Abrir menú de personaje',
            openUserMenu: 'Abrir menú de usuario',
            more: 'Más',
            administration: 'Administración',
            userAdministration: 'Administración de Usuarios',
            calendarSettings: 'Configuración de Calendario',
            notificationsTest: 'Prueba de Notificaciones',
            profile: 'Perfil',
            settings: 'Configuración',
            login: 'Iniciar Sesión',
            logout: 'Cerrar Sesión',
            home: 'Inicio',
            characters: 'Personajes',
            organizations: 'Organizaciones',
            documents: 'Documentos',
            inventory: 'Inventario',
        },
        breadcrumb: {
            editing: 'Editando:',
            viewing: 'Viendo:',
            creating: 'Creando',
            character: 'Personaje',
            organization: 'Organización',
            pending: 'Pendiente',
        },
        documents: {
            gameDocuments: 'Documentos del Juego',
            organizationDocuments: 'Documentos de Organización',
            personalDocuments: 'Documentos Personales',
            gameDocumentsDescription: 'Una lista de documentos relacionados con las decisiones de EOTIR.',
            organizationDocumentsDescription: 'Una lista de documentos relacionados con organizaciones específicas.',
            personalDocumentsDescription: 'Una lista de notas y documentos personales.',
            filterByOrganization: 'Filtrar por Organización:',
            allOrganizations: 'Todas las Organizaciones',
            addDocument: 'Agregar Documento',
            documentId: 'ID del Documento',
            title: 'Título',
            author: 'Autor',
            date: 'Fecha',
            status: 'Estado',
            access: 'Acceso',
            restricted: 'Restringido',
            clearanceRequired: 'Autorización Requerida',
            accessRestricted: 'Acceso Restringido',
            document: 'Documento',
            documentType: 'Tipo de Documento',
            creationDate: 'Fecha de Creación',
            organization: 'Organización',
            assignees: 'Asignados',
            content: 'Contenido',
            signedBy: 'Firmado por',
        },
    },
    fr: {
        common: {
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            cancel: 'Annuler',
            save: 'Enregistrer',
            edit: 'Modifier',
            delete: 'Supprimer',
            view: 'Voir',
            back: 'Retour',
            next: 'Suivant',
            previous: 'Précédent',
            search: 'Rechercher',
            filter: 'Filtrer',
            clear: 'Effacer',
            submit: 'Soumettre',
            close: 'Fermer',
            markAllAsRead: 'Marquer tout comme lu',
            markingAsRead: 'Marquage comme lu...',
            noNotifications: 'Aucune notification',
            allCaughtUp: 'Vous êtes à jour !',
            noMoreNotifications: 'Plus de notifications',
            viewDetails: 'Voir les détails →',
            // 404 page
            somethingsMissing: 'Quelque chose manque.',
            pageNotFound: 'Désolé, nous ne trouvons pas cette page. Vous trouverez beaucoup à explorer sur la page d\'accueil.',
            backToHomepage: 'Retour à l\'Accueil',
            // Common form labels
            age: 'Âge',
            status: 'Statut',
            type: 'Type',
            name: 'Nom',
            description: 'Description',
            // Common actions
            create: 'Créer',
            update: 'Mettre à jour',
            remove: 'Supprimer',
            approve: 'Approuver',
            reject: 'Rejeter',
            complete: 'Compléter',
        },
        sidebar: {
            navigation: 'Navigation',
            expand: 'Développer',
            collapse: 'Réduire',
            yourTeams: 'Vos équipes',
        },
        navigation: {
            home: 'Accueil',
            characters: 'Personnages',
            organizations: 'Organisations',
            documents: 'Documents',
            inventory: 'Inventaire',
            calendar: 'Calendrier',
            notifications: 'Notifications',
            profile: 'Profil',
            settings: 'Paramètres',
            admin: 'Administration',
        },
        time: {
            justNow: 'à l\'instant',
            minutesAgo: 'minutes plus tôt',
            hoursAgo: 'heures plus tôt',
            daysAgo: 'jours plus tôt',
            weeksAgo: 'semaines plus tôt',
            monthsAgo: 'mois plus tôt',
            yearsAgo: 'années plus tôt',
        },
        organizations: {
            galacticFactions: 'Factions Galactiques',
            majorPoliticalMilitary: 'Principales organisations politiques et militaires de la galaxie',
            createFaction: 'Créer une Faction',
            noFactions: 'Aucune faction',
            noFactionsCreated: 'Aucune faction n\'a encore été créée.',
            leader: 'Leader',
            vacant: 'Vacant',
            members: 'Membres',
            member: 'Membre',
            direct: 'direct',
            active: 'Actif',
            inactive: 'Inactif',
            suborganizations: 'Sous-organisations',
            suborganization: 'Sous-organisation',
        },
        notifications: {
            viewNotifications: 'Voir les notifications',
        },
        header: {
            openMainMenu: 'Ouvrir le menu principal',
            openCharacterMenu: 'Ouvrir le menu personnage',
            openUserMenu: 'Ouvrir le menu utilisateur',
            more: 'Plus',
            administration: 'Administration',
            userAdministration: 'Administration des Utilisateurs',
            calendarSettings: 'Paramètres de Calendrier',
            notificationsTest: 'Test de Notifications',
            profile: 'Profil',
            settings: 'Paramètres',
            login: 'Connexion',
            logout: 'Déconnexion',
            home: 'Accueil',
            characters: 'Personnages',
            organizations: 'Organisations',
            documents: 'Documents',
            inventory: 'Inventaire',
        },
        breadcrumb: {
            editing: 'Modification:',
            viewing: 'Affichage:',
            creating: 'Création',
            character: 'Personnage',
            organization: 'Organisation',
            pending: 'En attente',
        },
        documents: {
            gameDocuments: 'Documents de Jeu',
            organizationDocuments: 'Documents d\'Organisation',
            personalDocuments: 'Documents Personnels',
            gameDocumentsDescription: 'Une liste de documents liés aux décisions d\'EOTIR.',
            organizationDocumentsDescription: 'Une liste de documents liés à des organisations spécifiques.',
            personalDocumentsDescription: 'Une liste de notes et documents personnels.',
            filterByOrganization: 'Filtrer par Organisation:',
            allOrganizations: 'Toutes les Organisations',
            addDocument: 'Ajouter Document',
            documentId: 'ID du Document',
            title: 'Titre',
            author: 'Auteur',
            date: 'Date',
            status: 'Statut',
            access: 'Accès',
            restricted: 'Restreint',
            clearanceRequired: 'Autorisation Requise',
            accessRestricted: 'Accès Restreint',
            document: 'Document',
            documentType: 'Type de Document',
            creationDate: 'Date de Création',
            organization: 'Organisation',
            assignees: 'Assignés',
            content: 'Contenu',
            signedBy: 'Signé par',
        },
    },
    de: {
        common: {
            loading: 'Laden...',
            error: 'Fehler',
            success: 'Erfolg',
            cancel: 'Abbrechen',
            save: 'Speichern',
            edit: 'Bearbeiten',
            delete: 'Löschen',
            view: 'Ansehen',
            back: 'Zurück',
            next: 'Weiter',
            previous: 'Vorherige',
            search: 'Suchen',
            filter: 'Filtern',
            clear: 'Löschen',
            submit: 'Senden',
            close: 'Schließen',
            markAllAsRead: 'Alle als gelesen markieren',
            markingAsRead: 'Markiere als gelesen...',
            noNotifications: 'Keine Benachrichtigungen',
            allCaughtUp: 'Sie sind auf dem neuesten Stand!',
            noMoreNotifications: 'Keine weiteren Benachrichtigungen',
            viewDetails: 'Details anzeigen →',
            // 404 page
            somethingsMissing: 'Etwas fehlt.',
            pageNotFound: 'Entschuldigung, wir können diese Seite nicht finden. Sie finden viel zu entdecken auf der Startseite.',
            backToHomepage: 'Zurück zur Startseite',
            // Common form labels
            age: 'Alter',
            status: 'Status',
            type: 'Typ',
            name: 'Name',
            description: 'Beschreibung',
            // Common actions
            create: 'Erstellen',
            update: 'Aktualisieren',
            remove: 'Entfernen',
            approve: 'Genehmigen',
            reject: 'Ablehnen',
            complete: 'Abschließen',
        },
        sidebar: {
            navigation: 'Navigation',
            expand: 'Erweitern',
            collapse: 'Einklappen',
            yourTeams: 'Ihre Teams',
        },
        navigation: {
            home: 'Startseite',
            characters: 'Charaktere',
            organizations: 'Organisationen',
            documents: 'Dokumente',
            inventory: 'Inventar',
            calendar: 'Kalender',
            notifications: 'Benachrichtigungen',
            profile: 'Profil',
            settings: 'Einstellungen',
            admin: 'Verwaltung',
        },
        time: {
            justNow: 'gerade eben',
            minutesAgo: 'Minuten her',
            hoursAgo: 'Stunden her',
            daysAgo: 'Tage her',
            weeksAgo: 'Wochen her',
            monthsAgo: 'Monate her',
            yearsAgo: 'Jahre her',
        },
        organizations: {
            galacticFactions: 'Galaktische Fraktionen',
            majorPoliticalMilitary: 'Wichtige politische und militärische Organisationen in der Galaxie',
            createFaction: 'Fraktion Erstellen',
            noFactions: 'Keine Fraktionen',
            noFactionsCreated: 'Es wurden noch keine Fraktionen erstellt.',
            leader: 'Anführer',
            vacant: 'Vakant',
            members: 'Mitglieder',
            member: 'Mitglied',
            direct: 'direkt',
            active: 'Aktiv',
            inactive: 'Inaktiv',
            suborganizations: 'Unterorganisationen',
            suborganization: 'Unterorganisation',
        },
        notifications: {
            viewNotifications: 'Benachrichtigungen anzeigen',
        },
        header: {
            openMainMenu: 'Hauptmenü öffnen',
            openCharacterMenu: 'Charaktermenü öffnen',
            openUserMenu: 'Benutzermenü öffnen',
            more: 'Mehr',
            administration: 'Verwaltung',
            userAdministration: 'Benutzerverwaltung',
            calendarSettings: 'Kalendereinstellungen',
            notificationsTest: 'Benachrichtigungstest',
            profile: 'Profil',
            settings: 'Einstellungen',
            login: 'Anmelden',
            logout: 'Abmelden',
            home: 'Startseite',
            characters: 'Charaktere',
            organizations: 'Organisationen',
            documents: 'Dokumente',
            inventory: 'Inventar',
        },
        breadcrumb: {
            editing: 'Bearbeitung:',
            viewing: 'Anzeige:',
            creating: 'Erstellen',
            character: 'Charakter',
            organization: 'Organisation',
            pending: 'Ausstehend',
        },
        documents: {
            gameDocuments: 'Spiel-Dokumente',
            organizationDocuments: 'Organisations-Dokumente',
            personalDocuments: 'Persönliche Dokumente',
            gameDocumentsDescription: 'Eine Liste von Dokumenten zu EOTIR-Entscheidungen.',
            organizationDocumentsDescription: 'Eine Liste von Dokumenten zu spezifischen Organisationen.',
            personalDocumentsDescription: 'Eine Liste persönlicher Notizen und Dokumente.',
            filterByOrganization: 'Nach Organisation filtern:',
            allOrganizations: 'Alle Organisationen',
            addDocument: 'Dokument Hinzufügen',
            documentId: 'Dokument-ID',
            title: 'Titel',
            author: 'Autor',
            date: 'Datum',
            status: 'Status',
            access: 'Zugang',
            restricted: 'Beschränkt',
            clearanceRequired: 'Berechtigung Erforderlich',
            accessRestricted: 'Zugang Beschränkt',
            document: 'Dokument',
            documentType: 'Dokumenttyp',
            creationDate: 'Erstellungsdatum',
            organization: 'Organisation',
            assignees: 'Beauftragte',
            content: 'Inhalt',
            signedBy: 'Unterschrieben von',
        },
    },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage = 'en'): Translations {
    return translations[language] || translations.en;
}

/**
 * Hook to get translations based on user's language setting
 */
export function useTranslations(language: SupportedLanguage = 'en') {
    return getTranslations(language);
}