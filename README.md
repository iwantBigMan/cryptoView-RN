# CryptoView (React Native)

> 🪙 **멀티 거래소 암호화폐 자산 통합 관리 앱 — RN 전환 버전**

Kotlin/Compose Android 앱을 **React Native + TypeScript**로 마이그레이션하는 프로젝트입니다.  
여러 거래소(Upbit, Gate.io)의 보유 자산을 한 화면에서 확인하고, USDT ↔ KRW 자동 환산을 지원합니다.

- **Android (Kotlin)**: https://github.com/iwantBigMan/CryptoView/tree/dev  
- **React Native**: https://github.com/iwantBigMan/cryptoView-RN

---

## 📱 화면 구성

| 로그인 | 홈 대시보드 | 보유 코인 목록 | 코인 상세 | 설정 |
|:---:|:---:|:---:|:---:|:---:|
| 거래소 API 키 입력·검증 | 총 자산·도넛 차트·Top 5 | 검색·정렬·FlatList | 거래소별 포지션 | 연동 관리·로그아웃 |

---

## ✨ 구현된 기능

### 1. 로그인 / 거래소 연동
- 업비트(필수) + 해외 거래소(Gate.io) 드롭다운 선택
- API Key / Secret Key 입력 폼 + Secret 토글(보기/숨기기)
- **실제 거래소 API를 호출하여 크리덴셜 유효성 실시간 검증**
  - Upbit: `api.upbit.com/v1/accounts` — JWT Bearer 인증
  - Gate.io: `api.gateio.ws/api/v4/spot/accounts` — HMAC-SHA512 서명 인증
- 모든 거래소 검증 성공 시에만 MMKV에 배치 저장
- 저장된 거래소 목록 표시 + 개별 삭제 기능
- 로딩 상태 표시, 3초 자동 소멸 에러 메시지

### 2. 홈 대시보드 (AssetsOverview)
- **총 자산 카드**: 총 평가금액(₩), 24h 변동금액, 수익률 표시
- **거래소별 비중**: `DonutChart` 컴포넌트 (react-native-svg 기반)
- **Top 5 보유코인**: 평가금액 상위 5개 요약 카드 + "전체보기" 네비게이션

### 3. 보유 코인 목록 (Holdings)
- 심볼별 통합 자산 목록 (FlatList)
- 정렬: 평가금액 / 수익률 / 심볼명
- 검색: 심볼·코인명 실시간 필터링
- 거래소 뱃지 컬러 표시
- 코인 탭 → HoldingDetail 네비게이션

### 4. 코인 상세 (HoldingDetail)
- 특정 코인의 거래소별 보유량·평균단가·현재가·평가금액
- 수익/손실 금액 + 수익률 (색상 구분)
- KRW / USDT 통화 단위 태그 표시
- 수량 스마트 포매팅 (후행 0 제거)

### 5. 설정 (Settings)
- 연동된 거래소 목록 표시 (컬러 뱃지: 업비트 🔵 / Gate.io 🟣)
- 로그아웃 (확인 다이얼로그 → MMKV 전체 삭제)
- 앱 버전 정보 표시

---

## 🏗️ 네비게이션 구조

```
App.tsx (NativeStackNavigator)
├─ Login          — 로그인/연동 (hasRequiredCredentials() 체크)
├─ Main           — BottomTabNavigator
│  ├─ Home        → AssetsOverview (대시보드)
│  ├─ Holdings    → Holdings (보유 코인 목록)
│  └─ Settings    → Settings (설정)
└─ HoldingDetail  — 코인 상세 (스택 push, params: {symbol})
```

- 앱 진입 시 `credentialsManager.hasRequiredCredentials()`로 동기 인증 상태 확인
- 인증 완료 → `Main`, 미인증 → `Login`으로 초기 라우트 결정

---

## 📁 프로젝트 구조

```
src/
├── components/
│   └── DonutChart.tsx              # 도넛 차트 (react-native-svg)
├── data/
│   ├── mockCoins.ts                # Mock 데이터 (보유코인, 거래소 요약, 상세)
│   ├── local/
│   │   ├── mmkvStorage.ts          # MMKV 암호화 인스턴스 생성
│   │   └── credentialsManager.ts   # 거래소별 API Key 저장/조회/삭제
│   └── remote/
│       ├── authApi.ts              # 거래소 API 크리덴셜 검증 (Upbit, Gate.io)
│       └── authHelpers.ts          # JWT 생성 (Upbit) / HMAC-SHA512 서명 (Gate.io)
├── domain/
│   └── Coin.ts                     # 도메인 모델 & Enum
│       ├── ExchangeType            #   UPBIT | GATEIO
│       ├── CurrencyUnit            #   KRW | USDT
│       ├── HoldingData             #   거래소별 개별 보유 자산
│       ├── AggregatedHolding       #   심볼 기준 통합 자산
│       ├── ExchangeData            #   거래소별 요약
│       ├── ExchangeHoldingDetail   #   거래소별 코인 포지션
│       ├── ExchangeDisplayName     #   거래소 한글 표시명 매핑
│       └── ExchangeColor           #   거래소별 테마 컬러 매핑
├── hooks/
│   └── useLogin.ts                 # 로그인 상태 관리 커스텀 훅
├── screens/
│   ├── AssetsOverview/             # 홈 대시보드
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── HoldingDetail/              # 코인 상세
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Holdings/                   # 보유 코인 목록
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Login/                      # 로그인/연동
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Main/                       # 탭 네비게이터
│   │   └── index.tsx
│   └── Settings/                   # 설정
│       ├── index.tsx
│       └── styles.ts
└── theme/
    └── colors.ts                   # 테마 컬러 상수 (다크 테마 기반)
```

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|:---|:---|
| **Framework** | React Native 0.84.1 |
| **Language** | TypeScript 5.8 |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **로컬 저장소** | react-native-mmkv (암호화 스토리지) |
| **암호화** | crypto-js (HMAC-SHA256, HMAC-SHA512, SHA-512) |
| **인증** | Upbit JWT / Gate.io HMAC-SHA512 서명 |
| **차트** | react-native-svg (커스텀 DonutChart) |
| **안전 영역** | react-native-safe-area-context |
| **화면 최적화** | react-native-screens |
| **테스트** | Jest + React Test Renderer |
| **Node** | >= 22.11.0 |

---

## 🔐 보안 설계

| 항목 | 구현 |
|:---|:---|
| **API Key 저장** | MMKV 암호화 스토리지 (`encryptionKey` 적용) |
| **업비트 인증** | HMAC-SHA256 기반 JWT 토큰 생성 (`authHelpers.ts`) |
| **Gate.io 인증** | HMAC-SHA512 서명 + Timestamp + SHA-512 body hash |
| **크리덴셜 검증** | 저장 전 실제 API 호출로 유효성 사전 검증 |
| **저장 구조** | 거래소별 키 분리 저장 (`upbit_api_key`, `gateio_api_key` 등) |
| **앱 설계** | 자동 매매 미지원 — **조회 전용(View Only)** 구조 |
| **민감 정보** | 로그 출력 차단, HTTPS 전용 통신 |

---

## 🏗️ 데이터 레이어 구조

### 로컬 저장소 (`data/local/`)

**`mmkvStorage.ts`** — MMKV 암호화 인스턴스 생성
- `id: 'exchange-credentials'`로 격리된 저장 영역
- `encryptionKey`를 적용하여 디바이스 내 암호화

**`credentialsManager.ts`** — 거래소 크리덴셜 관리
- `saveCredentials(exchange, apiKey, secretKey)` — 거래소별 키 저장
- `getCredentials()` — 전체 크리덴셜 조회
- `clearCredentials(exchange)` — 특정 거래소 키 삭제
- `clearAll()` — 로그아웃 시 전체 삭제
- `hasRequiredCredentials()` — 업비트(필수) 인증 여부 동기 확인
- `getSavedExchanges()` — 연동된 거래소 목록 반환

### 원격 인증 (`data/remote/`)

**`authApi.ts`** — 거래소 API 크리덴셜 검증
- `validateUpbitCredentials()` → Upbit REST API로 JWT 인증 검증
- `validateGateCredentials()` → Gate.io REST API로 HMAC 서명 검증
- 검증 성공 시 `true`, 실패·예외 시 `false` 반환

**`authHelpers.ts`** — 인증 토큰 생성 유틸리티
- `generateUpbitAuthToken()` — HMAC-SHA256 JWT (Header + Payload + Signature)
- `generateGateSignature()` — HMAC-SHA512 Hex Digest 서명 생성
- `sha512Hex()` — SHA-512 해시 유틸리티

---

## 🪝 커스텀 훅

### `useLogin` (`hooks/useLogin.ts`)

로그인 화면의 전체 상태와 비즈니스 로직을 관리하는 커스텀 훅

**상태 관리:**
- 거래소별 API Key / Secret Key 입력값
- 선택된 해외 거래소 목록
- 저장된 크리덴셜 목록
- 로딩 / 에러 / 성공 상태

**핵심 플로우 (`saveCredentials`):**
1. 입력값 비어있는지 검증
2. 각 거래소 API 실시간 검증 (업비트 필수, Gate.io 선택)
3. 전체 검증 성공 시에만 MMKV에 배치 저장
4. `onLoginSuccess()` 콜백 호출

---

## 📋 진행 상황

### ✅ 완료

| 항목 | 설명 |
|:---|:---|
| RN + TS 프로젝트 세팅 | React Native 0.84.1, TypeScript 5.8, 기본 빌드 설정 |
| 네비게이션 구조 | Stack(Login → Main → HoldingDetail) + Bottom Tab(Home, Holdings, Settings) |
| 도메인 모델 정의 | ExchangeType, CurrencyUnit, HoldingData, AggregatedHolding, ExchangeHoldingDetail 등 |
| Mock 데이터 구성 | 보유코인, 거래소 요약, 코인 상세 목 데이터 일괄 생성 |
| 홈 대시보드 UI | 총 자산 카드 + 도넛 차트 + Top 5 Holdings |
| 보유 코인 목록 UI | FlatList + 검색 + 정렬(평가금액/수익률/심볼) |
| 코인 상세 UI | 거래소별 포지션 카드 + KRW/USDT 포매팅 |
| 로그인/거래소 연동 UI | 업비트(필수) + 해외 거래소 선택, API 키 입력 폼, 에러/로딩 상태 |
| 설정 UI | 연동 거래소 표시, 로그아웃 (확인 다이얼로그) |
| 테마 시스템 | colors.ts — 다크 컬러 팔레트 (40+ 색상 상수) |
| DonutChart 컴포넌트 | react-native-svg 기반 커스텀 도넛 차트 |
| 심볼 정규화 | 다중 거래소 동일 코인 AggregatedHolding으로 통합 |
| 거래소 인증 구현 | Upbit JWT (HMAC-SHA256) + Gate.io HMAC-SHA512 서명 |
| API 크리덴셜 검증 | 저장 전 실제 거래소 API 호출로 유효성 실시간 검증 |
| 암호화 저장소 구현 | react-native-mmkv 암호화 스토리지 기반 API Key 저장 |
| 크리덴셜 매니저 | 거래소별 키 저장·조회·삭제·전체삭제·인증상태확인 |
| useLogin 훅 | 로그인 폼 상태 + 검증 + 저장 비즈니스 로직 분리 |

### 🚧 진행 중 / 예정

| 항목 | 상태 | 설명 |
|:---|:---:|:---|
| 실제 자산 조회 API 연동 | 🚧 | Mock → 업비트/Gate.io 잔고·시세 REST API 호출 |
| USDT→KRW 환산 | 📝 | 업비트 USDT/KRW 시세 기준 자동 환산 |
| 상태관리 도입 | 📝 | Context / Zustand 등 글로벌 상태 관리 |
| Gate.io 선물 | 📝 | 선물 포지션 조회 기능 |
| KRW ↔ USDT 전환 버튼 | 📝 | 평가 기준 통화 전환 기능 |
| 알림 | 📝 | 목표가, 수익률 도달 알림 |
| 백그라운드 동기화 | 📝 | 백그라운드 자산 갱신 |
| 다크/라이트 모드 전환 | 📝 | 시스템 테마 연동 |
| 텍스트 컬러 커스텀 설정 | 📝 | 설정 화면에서 사용자 지정 |
| 테스트 확장 | 📝 | 컴포넌트/로직 단위 테스트 |

---

## 🚀 실행 방법

```bash
git clone <repo-url>
cd cryptoView
npm install

# Android
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios

# Metro 서버만 실행
npm start
```

---

## 📄 라이선스

Personal / Educational use only.
