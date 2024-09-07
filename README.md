
# Vault Management

**Vault Management** güvenli anahtar yönetimi, kullanıcı doğrulama ve çeşitli bulut hizmetlerini yönetme gibi işlemleri kolaylaştırmak için geliştirilmiş bir çözümdür. Proje, hem yönetim paneli hem de SDK desteği sunarak kullanıcıların güvenli bir şekilde hizmetleri yönetmesine ve izlenmesine olanak tanır. Firebase entegrasyonu ile güçlü kimlik doğrulama ve veritabanı yönetimi sağlanmaktadır.


**NOT:**  JavaScript ile geliştirilen, ancak TypeScript'e geçiş sürecinde olan bir proje olup, hem sunucu tarafında hem de modül olarak hizmet verebilen bir çözüm sunmaktadır. Bu proje, kullanıcıların güvenli anahtar yönetimi, kimlik doğrulama ve bulut hizmetlerinin entegrasyonu gibi ihtiyaçlarını karşılamak üzere tasarlanmıştır. Yönetim paneli ve SDK desteğiyle, kullanıcıların hem kolay hem de güvenli bir şekilde hizmetleri yönetmesine olanak tanır. Firebase entegrasyonu sayesinde güçlü kimlik doğrulama, güvenli veri yönetimi ve gelişmiş yapılandırma seçenekleri sunulmaktadır.

Proje, özellikle:
- Hassas verilerin (API anahtarları, bağlantı bilgileri vb.) güvenli yönetimi,
- Firebase tabanlı kimlik doğrulama ve veri yönetimi,
- Yönetim paneli üzerinden kolay yapılandırma ve kontrol imkanı sunar.

---

## Firebase Entegrasyonu

Bu projede Firebase, kimlik doğrulama, veritabanı (Firestore) ve diğer servisler için temel yapı taşıdır. Firebase yapılandırmasını tamamlamak için aşağıdaki adımları izleyin.

### Firebase Proje Kurulumu ve Yapılandırması

1. **Firebase Console'a Giriş**:
   - [Firebase Console](https://console.firebase.google.com/) adresine gidin ve Google hesabınızla giriş yapın.
   - Yeni bir proje oluşturmak için "Add Project" butonuna tıklayın ve proje adı olarak `vault-management-panel` gibi bir isim belirleyin.

2. **Firebase Config Bilgilerini Alma**:
   - Proje ayarlarına gidin ve web uygulaması ekleyin.
   - Firebase size aşağıdaki gibi bir yapılandırma bilgisi verecek:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_FIREBASE_API_KEY",
       authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
       projectId: "YOUR_FIREBASE_PROJECT_ID",
       storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
       messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
       appId: "YOUR_FIREBASE_APP_ID",
       measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
     };
     ```

3. **.env.production Dosyasına Firebase Bilgilerini Ekleyin**:
   Firebase'den aldığınız yapılandırma bilgilerini `.env.production` dosyasına ekleyin. Bu dosya, projedeki tüm Firebase yapılandırma bilgilerini içerir.

   **Örnek .env.production Dosyası**:
   ```bash
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   FIREBASE_APP_ID=your-firebase-app-id
   FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   ```

4. **Firebase Admin SDK için JSON Dosyasını İndirin**:
   - Firebase Console'da **Project Settings** bölümünden **Service Accounts** sekmesine gidin.
   - "Generate New Private Key" butonuna tıklayın ve JSON dosyasını indirin. Bu dosya Firebase Admin SDK ile kullanılacaktır.
   
5. **Firebase Admin SDK Yapılandırması**:
   - İndirdiğiniz JSON dosyasındaki verileri kullanarak, **.env.production** dosyasına eklemelisiniz. Admin tarafında yapılacak işlemler için bu bilgiler gereklidir.
   - **Örnek .env.production Yapılandırması**:
     ```bash
     FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"
     FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
     FIREBASE_ADMIN_PROJECT_ID=your-firebase-project-id
     FIREBASE_ADMIN_PRIVATE_KEY_ID=your-private-key-id
     FIREBASE_ADMIN_TOKEN_URI=your-token-uri
     FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=your-auth-provider-cert-url
     FIREBASE_ADMIN_CLIENT_CERT_URL=your-client-cert-url
     ```

---

## Ortam Değişkenleri (.env) Yapılandırması

Firebase yapılandırmanızı tamamlamak için `.env.production` dosyasını oluşturun ve Firebase'den aldığınız yapılandırma bilgilerini bu dosyaya ekleyin. Aynı zamanda Firebase Admin SDK için gereken JSON dosyasındaki bilgileri de bu dosyaya ekleyin.

**Örnek .env.production Dosyası**:

```bash
# Firebase Client SDK Config
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

# Firebase Admin SDK Config
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PROJECT_ID=your-firebase-project-id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_ADMIN_TOKEN_URI=your-token-uri
FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=your-auth-provider-cert-url
FIREBASE_ADMIN_CLIENT_CERT_URL=your-client-cert-url
```


## Docker Compose ile Projeyi Başlatma

Ortam değişkenleri (.env.production) ayarlandıktan ve gerekli yapılandırmalar yapıldıktan sonra, Docker konteynerinizi aşağıdaki komutla çalıştırabilirsiniz:

```bash
docker-compose --env-file .env.production up --build -d
```

### Komutun Açıklaması:

- **`--env-file .env.production`**: Bu parametre, Docker'ın **.env.production** dosyasını kullanarak ortam değişkenlerini yüklemesini sağlar.
- **`up --build`**: Docker Compose ile servisi başlatır ve eğer imajlar yoksa ya da değişiklik varsa yeniden build eder.
- **`-d`**: Bu parametre, Docker konteynerinin arka planda (detached mode) çalışmasını sağlar.

### Docker Komutunu Çalıştırdıktan Sonra:

1. **Konteynerin Başarıyla Çalıştığını Doğrulayın**:
   - Docker konteynerlerinin doğru şekilde çalışıp çalışmadığını kontrol etmek için şu komutu kullanabilirsiniz:
     ```bash
     docker ps
     ```
   Bu komut, çalışan konteynerlerin listesini gösterir ve `vault-management-container` adındaki konteynerin çalıştığını görmelisiniz.

2. **Uygulamayı Kontrol Edin**:
   - Uygulamanız varsayılan olarak 3001 portunda çalışıyor olacak. Şu URL'den uygulamanızın çalışıp çalışmadığını kontrol edebilirsiniz:
     ```
     http://localhost:3001
     ```

3. **Logları Kontrol Edin**:
   - Eğer bir sorun yaşıyorsanız, konteyner loglarını inceleyerek sorunu teşhis edebilirsiniz:
     ```bash
     docker-compose logs
     ```

4. **Konteyneri Durdurmak**:
   - Uygulamayı durdurmak isterseniz, şu komutu kullanarak tüm konteynerleri kapatabilirsiniz:
     ```bash
     docker-compose down
     ```


## Firebase Authentication Yapılandırması

### Firebase Authentication ile kullanıcıların giriş yapabilmesi için şu adımları takip edin:

1. **Authentication Paneline Giriş:**
   - Firebase Console'da projenize gidin.
   - Sol menüde **Authentication** sekmesine tıklayın ve **Sign-in method** bölümüne geçin.

2. **Giriş Yöntemi Ekleme:**
   - **Email/Password** oturum açma yöntemini etkinleştirin.
   - Bu yöntem, kullanıcıların e-posta ve şifre ile kimlik doğrulaması yapmalarını sağlayacaktır.

3. **Manuel Kullanıcı Oluşturma:**
   - Firebase Authentication üzerinde **Users** sekmesine gidin.
   - Manuel olarak kullanıcı ekleyin veya Firebase Admin SDK ile kullanıcı oluşturma işlemlerini gerçekleştirin.

---

## Firestore ile Kullanıcı Verisi Saklama

Kullanıcıların oturum açmasının yanı sıra, kullanıcıya ait profil bilgilerini **Firestore**'daki **users** koleksiyonunda saklamalısınız. Bu koleksiyon, kimlik doğrulanan kullanıcıların detaylı profil bilgilerini barındıracaktır.

### Kullanıcı Kayıt ve Firestore İşlemleri:

Bir kullanıcı **email & password** ile oturum açtıktan sonra, Firebase Authentication'daki verisi ile Firestore'daki **users** koleksiyonundaki veriler birbiriyle ilişkilendirilmelidir. Bu ilişkiyi sağlamak için kullanıcının **uid** değeri kullanılır.

---

### Firebase ile Oturum Açma ve Kullanıcı Bilgisi Kaydetme:

Firebase Authentication ile kullanıcının kaydını yaptıktan sonra, bu kullanıcıyı **Firestore**'da da saklamak için aşağıdaki adımları takip edebilirsiniz:

1. **Kullanıcı Oluşturma ve Firestore'da Kaydetme (Sign-up)**:
   Firebase Authentication ile yeni kullanıcı oluşturulduktan sonra, kullanıcı bilgilerini Firestore'daki **users** koleksiyonuna kaydedin.
   
   ```javascript
   import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
   import { doc, setDoc } from 'firebase/firestore';
   import { db } from '../../../firebase'; // Firestore bağlantısı

   const auth = getAuth();

   export const signUpUser = async (email, password, userData) => {
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;

       await setDoc(doc(db, 'users', user.uid), {
         email: user.email,
         name: userData.name,
         avatarURL: userData.avatarURL || '',
         role: userData.role || 'user',
       });

       console.log('Kullanıcı başarıyla kaydedildi:', user.uid);
       return user.uid;
     } catch (error) {
       console.error('Kullanıcı kaydedilirken hata oluştu:', error);
       throw error;
     }
   };
   ```

2. **Kullanıcı Giriş Yapma ve Verileri Getirme (Sign-in)**:
   Kullanıcı giriş yaptıktan sonra, Firestore'dan kullanıcının profil bilgilerini getirin.
   
   ```javascript
   import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
   import { doc, getDoc } from 'firebase/firestore';
   import { db } from '../../../firebase'; // Firestore bağlantısı

   const auth = getAuth();

   export const signInUser = async (email, password) => {
     try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;

       const userDocRef = doc(db, 'users', user.uid);
       const userDoc = await getDoc(userDocRef);

       if (userDoc.exists()) {
         const userData = userDoc.data();
         console.log('Kullanıcı verisi:', userData);
         return { ...userData, uid: user.uid };
       } else {
         console.log('Kullanıcı Firestore'da bulunamadı.');
         return null;
       }
     } catch (error) {
       console.error('Kullanıcı girişinde hata oluştu:', error);
       throw error;
     }
   };
   ```

### Firestore Güvenlik Kuralları

Firestore güvenlik kuralları, uygulamanın veri erişim ve manipülasyon haklarını kontrol eder. Test ortamında, veritabanına herkesin erişmesine izin vermek için basit bir yapılandırma kullanabilirsiniz. Daha sonra bu kurallar üretim ortamında sıkılaştırılmalıdır.

#### Firestore Güvenlik Kurallarını Ayarlama

1. **Firebase Console** üzerinden projenize gidin.
2. Sol menüden **Firestore Database**'e tıklayın.
3. **Rules** sekmesine geçin.
4. Aşağıdaki kuralları ekleyin:


```plaintext
  rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
```
Bu kurallar, herkese okuma ve yazma izni verir. Bu sadece test amaçlıdır ve verilerinizin güvenliği için üretim ortamında kullanılmamalıdır.

#### Üretim Ortamı İçin Öneriler

Üretim ortamında, sadece kimliği doğrulanmış kullanıcıların okuma ve yazma işlemlerine izin veren kurallar kullanmalısınız. Örneğin:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

```


Bu kural, yalnızca oturum açmış kullanıcıların verilere erişmesine izin verir. Üretim ortamında daha güvenli bir yapı sağlar.


---

Not
Bu proje, gelecekte npm modülü olarak kullanılmak üzere hazırlanmıştır. Şu anda modül desteği geliştirme aşamasındadır ve tamamlandığında npm üzerinden kullanıma sunulacaktır. Projenin ilk aşamalarında sadece npm üzerinde yayınlanacak olup, GitHub Packages'a eklenmesine gerek duyulmamaktadır.

İleride, modül desteği tamamlandığında ve npm'ye yayınlandığında, daha fazla entegrasyon ve genişletilebilirlik sağlayacak şekilde düzenlenecektir.

1.0.0 sürümü için **features** milestonelarına ve ilgili **issue**lara göre güncellemeler belirtilecektir.