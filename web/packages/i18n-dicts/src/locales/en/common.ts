const common = {
  'common.ok': 'OK',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.loading': 'Loading...',

  // Shell header
  'shell.nav.home': 'Home',
  'shell.nav.suggestions': 'Suggestions',
  'shell.nav.ethic': 'Ethic',
  'shell.nav.access': 'Access',
  'shell.nav.audit': 'Audit',
  'shell.nav.users': 'Users',
  'shell.nav.themes': 'Themes',
  'shell.nav.services': 'Services',
  'shell.nav.designLab': 'Design Lab',
  'shell.nav.more': 'More',
  'shell.nav.welcome': 'Welcome to the Home Page',
  'shell.header.language': 'Language',
  'shell.header.theme': 'Theme',
  'shell.header.loginPanel': 'Login Panel',
  'shell.header.profileSoon': 'Profile (soon)',
  'shell.header.logout': 'Log out',
  'shell.header.lastLogin': 'Last Login: {value}',
  'shell.header.neverLoggedIn': 'Has not logged in yet',
  'shell.header.defaultUser': 'Standard User',
  'shell.header.languageSelectAria': 'Language selection',
  'shell.header.permitAllNoLogin': 'No sign-in is required in PermitAll mode.',
  'shell.header.suspenseLoading': 'Loading...',
  'shell.userMenu.title': 'User',
  'shell.toast.dismiss': 'Dismiss notification',
  'shell.nav.morePages': 'More pages',

  // Shell language names
  'shell.language.tr': 'Turkish',
  'shell.language.en': 'English',
  'shell.language.de': 'German',
  'shell.language.es': 'Spanish',

  // Shell app launcher
  'shell.launcher.title': 'Applications',
  'shell.launcher.close': 'Close',
  'shell.launcher.home.description': 'Console home screen',
  'shell.launcher.suggestions.description': 'Suggestion & feedback module',
  'shell.launcher.ethic.description': 'Ethics reporting module',
  'shell.launcher.access.description': 'Role & policy management',
  'shell.launcher.users.description': 'User management',

  // Shell shortcuts
  'shell.shortcuts.searchSoon.title': 'Global search shortcut is coming soon',
  'shell.shortcuts.searchSoon.description':
    'Use the navigation menu until the command palette is ready.',
  'shell.shortcuts.commandPaletteSoon.title': 'Command palette is being prepared',
  'shell.shortcuts.commandPaletteSoon.description':
    'The command palette integration will be completed in task SP2-2.',
  'shell.shortcuts.refreshDisabled.title': 'Refresh shortcut is disabled',
  'shell.shortcuts.refreshDisabled.description':
    'We are still refining the MFE refresh experience.',

  // Shell theme runtime panel
  'shell.theme.errors.loadThemes': 'Themes could not be loaded.',
  'shell.theme.errors.loadRegistry': 'Theme registry could not be loaded.',
  'shell.theme.errors.selectPersonalTheme': 'Select a personal theme to edit colors.',
  'shell.theme.errors.selectPersonalThemeFirst': 'Select a personal theme first.',
  'shell.theme.errors.personalThemeLimit': 'You can create up to 3 personal themes.',
  'shell.theme.errors.copyFailed': 'The theme could not be copied.',
  'shell.theme.errors.deleteFailed': 'The theme could not be deleted.',
  'shell.theme.errors.overrideSaveFailed': 'Theme overrides could not be saved.',
  'shell.theme.panel.triggerAria': 'Theme panel',
  'shell.theme.panel.triggerText': 'Appearance',
  'shell.theme.panel.dialogLabel': 'Theme axes',
  'shell.theme.panel.paletteTitle': 'Theme palette',
  'shell.theme.panel.loadingThemes': 'Themes are loading…',
  'shell.theme.panel.globalPaletteEmpty': 'No global theme palette was found.',
  'shell.theme.panel.globalThemeAria': 'Global theme: {label}',
  'shell.theme.panel.profileThemeLabel': 'Profile theme (backend)',
  'shell.theme.panel.myThemesCount': 'My themes ({count}/{limit})',
  'shell.theme.panel.forkTitle.limit': 'You can create up to 3 personal themes.',
  'shell.theme.panel.forkTitle.noPalette': 'Load the global theme palette first.',
  'shell.theme.panel.forkTitle.ready': 'Copy the selected global theme and customize it',
  'shell.theme.panel.forkButton': 'Copy and customize',
  'shell.theme.panel.personalLabel': 'Personal',
  'shell.theme.panel.deleteThemeTitle': 'Delete theme',
  'shell.theme.panel.noThemes': 'No theme has been defined yet.',
  'shell.theme.panel.personalColorsAction': 'Personal theme colors',
  'shell.theme.panel.personalColorsHintSelect': 'Select a personal theme to edit colors.',
  'shell.theme.panel.personalColorsHintLoading': 'Registry is loading…',
  'shell.theme.panel.personalColorsHintMissingRegistry': 'Theme registry was not found.',
  'shell.theme.panel.personalColorsHintReady': 'Edit personal theme colors',
  'shell.theme.panel.paletteHint':
    'The theme palette is only for theme selection; edit colors and other settings in the customization area.',
  'shell.theme.panel.editorTitle': 'Personal theme colors',
  'shell.theme.panel.saving': 'Saving…',
  'shell.theme.panel.close': 'Close',
  'shell.theme.panel.registryLoading': 'Registry is loading…',
  'shell.theme.panel.noEditableRegistry': 'No editable registry field was found.',
  'shell.theme.panel.colorInputPlaceholder': '#rrggbb or rgba(...)',
  'shell.theme.panel.colorPickerAria': 'Pick color for {label}',
  'shell.theme.panel.clearOverride': 'Clear override',

  // Login / register
  'auth.login.title': 'Sign In',
  'auth.login.emailLabel': 'Email',
  'auth.login.emailPlaceholder': 'example@example.com',
  'auth.login.passwordLabel': 'Password',
  'auth.login.passwordPlaceholder': 'Password',
  'auth.login.submit': 'Sign In',
  'auth.login.failed': 'Sign in failed',
  'auth.login.noAccount': 'Don’t have an account?',
  'auth.login.registerCta': 'Sign Up',

  'auth.register.title': 'Sign Up',
  'auth.register.nameLabel': 'Full Name',
  'auth.register.namePlaceholder': 'Your name',
  'auth.register.emailLabel': 'Email',
  'auth.register.emailPlaceholder': 'example@example.com',
  'auth.register.passwordLabel': 'Password',
  'auth.register.passwordPlaceholder': 'Password',
  'auth.register.requirement.length': 'At least 8 characters',
  'auth.register.requirement.uppercase': 'One uppercase letter',
  'auth.register.requirement.lowercase': 'One lowercase letter',
  'auth.register.requirement.number': 'One number',
  'auth.register.requirement.special': 'One special character',
  'auth.register.submit': 'Sign Up',
  'auth.register.failed': 'Registration failed',
  'auth.register.success':
    'Your registration request has been received. Your account will be activated after verification and admin approval.',
  'auth.register.hasAccount': 'Already have an account?',
  'auth.register.loginCta': 'Sign In',

  // Login popover
  'auth.popover.title': 'Quick Sign In',
  'auth.popover.fullscreen': 'Fullscreen',

  // Unauthorized page
  'auth.unauthorized.title': 'You do not have access',
  'auth.unauthorized.description':
    'You do not have the necessary permissions to access this page. If you think this is a mistake, please contact your system administrator.',
  'auth.unauthorized.back': 'Go Back',
  'auth.unauthorized.home': 'Home',

  // Session
  'auth.session.expired': 'Your session has expired',
  'auth.session.expired.description': 'Please sign in again.',
  'auth.session.validating': 'Validating session...',
};

export default common;
