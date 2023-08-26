import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
    await OneSignal.init({
        allowLocalhostAsSecureOrigin: true,
        appId: process.env.REACT_APP_ONESIGNAL_ID,
        // autoResubscribe: false,
    }).then(() => {
        OneSignal.getUserId((userId) => {
            localStorage.setItem('oneSignalId.bmd', userId);
        });
    });
}
