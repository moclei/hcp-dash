import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    favoriteColor?: string;
    isEditor?: boolean;
    accessToken?: string;
    refreshToken?: string;
    expirationTime?: number;
    isPropertyAccount?: boolean;
    propertyFilter?: string;
}

@Injectable()
export class AuthService {
    private editPermissions = [
        'marcocleirigh@hcptexas.com',
        'housingspecialist@hcptexas.com',
        'mrust@hcptexas.com',
        'mhurley@hcptexas.com',
        'corky@hcptexas.com',
        'accountsrec4@hcptexas.com',
        'michelle@hcptexas.com'
    ];
    private propertyAccounts = [
        {
            'email': 'marcocleirigh@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'mrust@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'corky@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'mhurley@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'accountsrec4@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'alamo@hcptexas.com',
            'filterName': 'Alamo'
        },
        {
            'email': 'banyantree@hcptexas.com',
            'filterName': 'Banyan Tree'
        },
        {
            'email': 'cabana@hcptexas.com',
            'filterName': 'Cabana'
        },
        {
            'email': 'diplomat@hcptexas.com',
            'filterName': 'Diplomat'
        },
        {
            'email': 'hillside@hcptexas.com',
            'filterName': 'Hillside'
        },
        {
            'email': 'kennedy@hcptexas.com',
            'filterName': 'Kennedy'
        },
        {
            'email': 'lockwood@hcptexas.com',
            'filterName': 'Lockwood'
        },
        {
            'email': 'legacy@hcptexas.com',
            'filterName': 'Legacy'
        },
        {
            'email': 'lahacienda@hcptexas.com',
            'filterName': 'La Hacienda'
        },
        {
            'email': 'marbachmanor@hcptexas.com',
            'filterName': 'Marbach'
        },
        {
            'email': 'mandalay@hcptexas.com',
            'filterName': 'Mandalay'
        },
        {
            'email': 'riviera@hcptexas.com',
            'filterName': 'Riviera'
        },
        {
            'email': 'springvale@hcptexas.com',
            'filterName': 'Springvale'
        },
        {
            'email': 'sulphur@hcptexas.com',
            'filterName': 'Sulphur'
        },
        {
            'email': 'sirjohn@hcptexas.com',
            'filterName': 'Sir John'
        },
        {
            'email': 'westbury@hcptexas.com',
            'filterName': 'Westbury'
        },
        {
            'email': 'westwinds@hcptexas.com',
            'filterName': 'Westwinds'
        },
        {
            'email': 'houses@hcptexas.com',
            'filterName': 'Houses'
        },
        {
            'email': 'frontdesk@hcptexas.com',
            'filterName': 'Houses'
        },
        {
            'email': 'juliaestrada@hcptexas.com',
            'filterName': 'Houses'
        },
        {
            'email': 'dion@hcptexas.com',
            'filterName': 'Houses'
        },
        {
            'email': 'ismael@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'purchasing@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'accountsrec4@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'esther@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'accountspayable@hcptexas.com',
            'filterName': ''
        },
        {
            'email': 'michelle@hcptexas.com',
            'filterName': ''
        },
    ];
    user: Observable<User>;
    redirectUrl: string;
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router) {

        //// Get auth data, then get firestore user document || null
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }
    googleLogin(redirectUrl) {
        this.redirectUrl = redirectUrl;
        const provider = new auth.GoogleAuthProvider();
        provider.setCustomParameters({
            hd: 'hcptexas.com',
            access_type: 'offline'
        });
        provider.addScope('https://mail.google.com/');
        provider.addScope('https://www.googleapis.com/auth/documents');
        provider.addScope('https://www.googleapis.com/auth/drive');
        provider.addScope('https://www.googleapis.com/auth/spreadsheets');
        return this.oAuthLogin(provider);
    }
    getFilterName(user: User) {
        for (let i = 0; i < this.propertyAccounts.length; i++) {
            const account = this.propertyAccounts[i];
            // console.log('Auth: account.email: ' + account.email + ', user.email: ' + user.email);
            if (account.email === user.email) {
                return account.filterName;
            }
        }
    }
    private oAuthLogin(provider) {
        this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                const userJSON = JSON.parse(JSON.stringify(credential.user));
                // console.log('user.tokenManager: ' + userJSON.stsTokenManager.refreshToken);
                const accessToken = credential.credential.accessToken;
                const refreshToken = userJSON.stsTokenManager.refreshToken;
                const expirationTime = userJSON.stsTokenManager.expirationTime;
                console.log('Expiration date/time: ' + new Date(expirationTime));
                this.updateUserData(credential.user, accessToken, refreshToken, expirationTime);
                if (this.redirectUrl) {
                    console.log('user.service => signInSuccessHandler => redirect url: ' + this.redirectUrl);
                    this.router.navigate([this.redirectUrl]);
                }
            });
    }
    private updateUserData(user, token, refresh, time) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        console.log('auth token? ' + token);
        let isPropertyAccount = false;
        let propertyFilter = '';
        for (let i = 0; i < this.propertyAccounts.length; i++) {
            const account = this.propertyAccounts[i];
            if (account.email === user.email) {
                isPropertyAccount = true;
                propertyFilter = account.filterName;
            }
        }
        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isEditor: this.editPermissions.includes(user.email),
            accessToken: token,
            refreshToken: refresh,
            expirationTime: time,
            isPropertyAccount: isPropertyAccount,
            propertyFilter: propertyFilter
        };
        return userRef.set(data, { merge: true });
    }
    signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['login-page']);
        });
    }
}
