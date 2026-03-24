# CryptoView (React Native)

> 🪙 **멀티 거래소 암호화폐 자산 통합 관리 앱 — RN 전환 버전**

Kotlin/Compose Android 앱을 **React Native + TypeScript**로 마이그레이션하는 프로젝트입니다.  
여러 거래소(Upbit, Gate.io)의 보유 자산을 한 화면에서 확인하고, USDT ↔ KRW 자동 환산을 지원합니다.

---

## 📱 화면 구성

| 로그인 | 홈 대시보드 | 보유 코인 목록 | 코인 상세 | 설정 |
|:---:|:---:|:---:|:---:|:---:|
| 거래소 API 키 입력 | 총 자산·도넛 차트·Top 5 | 검색·정렬·FlatList | 거래소별 포지션 | 연동 관리·로그아웃 |

---

## ✨ 구현된 기능

### 1. 로그인 / 거래소 연동
- 업비트(필수) + 해외 거래소(Gate.io) 드롭다운 선택
- API Key / Secret Key 입력 폼
- Secret 토글(보기/숨기기) 지원
- 연동 상태(저장됨 ✓) 표시

### 2. 홈 대시보드 (AssetsOverview)
- **총 자산 카드**: 총 평가금액, 변동금액, 수익률 표시
- **거래소별 비중**: `DonutChart` 컴포넌트 (react-native-svg 기반)
- **Top 5 보유코인**: 평가금액 상위 5개 요약 카드

### 3. 보유 코인 목록 (Holdings)
- 심볼별 통합 자산 목록 (FlatList)
- 정렬: 평가금액 / 수익률 / 심볼명
- 검색: 심볼·코인명 실시간 필터링
- 거래소 뱃지 컬러 표시

### 4. 코인 상세 (HoldingDetail)
- 특정 코인의 거래소별 보유량·평균단가·평가금액·수익률
- KRW / USDT 단위 포매팅

### 5. 설정 (Settings)
- 연동된 거래소 목록 표시 (컬러 뱃지)
- 다크모드 토글
- 로그아웃 (확인 다이얼로그)

---

## 🏗️ 네비게이션 구조

```
App.tsx (NativeStackNavigator)
├─ Login          — 로그인/연동 화면
├─ Main           — BottomTabNavigator
│  ├─ Home        → AssetsOverview (대시보드)
│  ├─ Holdings    → Holdings (보유 코인 목록)
│  └─ Settings    → Settings (설정)
└─ HoldingDetail  — 코인 상세 (스택 push)
```

---

## 📁 프로젝트 구조

```
src/
├── components/
│   └── DonutChart.tsx          # 도넛 차트 (react-native-svg)
├── data/
│   └── mockCoins.ts            # Mock 데이터 (보유코인, 거래소 요약, 상세)
├── domain/
│   └── Coin.ts                 # 도메인 모델 & Enum
│       ├── ExchangeType        # UPBIT | GATEIO
│       ├── CurrencyUnit        # KRW | USDT
│       ├── HoldingData         # 거래소별 개별 보유 자산
│       ├── AggregatedHolding   # 심볼 기준 통합 자산
│       ├── ExchangeData        # 거래소별 요약
│       └── ExchangeHoldingDetail # 거래소별 코인 포지션
├── hooks/                      # (빈 디렉터리 — 커스텀 훅 예정)
├── screens/
│   ├── AssetsOverview/         # 홈 대시보드
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── HoldingDetail/          # 코인 상세
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Holdings/               # 보유 코인 목록
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Login/                  # 로그인/연동
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Main/                   # 탭 네비게이터
│   │   └── index.tsx
│   └── Settings/               # 설정
│       ├── index.tsx
│       └── styles.ts
└── theme/
    └── colors.ts               # 테마 컬러 상수 (다크 테마 기반)
```

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|:---|:---|
| **Framework** | React Native 0.84 |
| **Language** | TypeScript 5.8 |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **Chart** | react-native-svg (커스텀 DonutChart) |
| **Safe Area** | react-native-safe-area-context |
| **Screen** | react-native-screens |
| **Test** | Jest + React Test Renderer |
| **Node** | >= 22.11.0 |

---

## 📋 진행 상황

### ✅ 완료

| 항목 | 설명 |
|:---|:---|
| RN + TS 프로젝트 세팅 | React Native 0.84, TypeScript 5.8, 기본 빌드 설정 |
| 네비게이션 구조 | Stack(Login → Main → HoldingDetail) + Bottom Tab(Home, Holdings, Settings) |
| 도메인 모델 정의 | ExchangeType, HoldingData, AggregatedHolding, ExchangeHoldingDetail 등 |
| Mock 데이터 구성 | 보유코인, 거래소 요약, 코인 상세 목 데이터 일괄 생성 |
| 홈 대시보드 UI | 총 자산 카드 + 도넛 차트 + Top 5 Holdings |
| 보유 코인 목록 UI | FlatList + 검색 + 정렬(평가금액/수익률/심볼) |
| 코인 상세 UI | 거래소별 포지션 카드 + KRW/USDT 포매팅 |
| 로그인/거래소 연동 UI | 업비트(필수) + 해외 거래소 선택, API 키 입력 폼 |
| 설정 UI | 연동 거래소 표시, 다크모드, 로그아웃 |
| 테마 시스템 | colors.ts — Android 버전과 동일한 다크 컬러 팔레트 |
| DonutChart 컴포넌트 | react-native-svg 기반 커스텀 도넛 차트 |
| 심볼 정규화 | 다중 거래소 동일 코인 AggregatedHolding으로 통합 |

### 🚧 진행 중 / 예정

| 항목 | 상태 | 설명 |
|:---|:---:|:---|
| 실제 API 연동 | 📝 | Mock → 업비트/Gate.io REST API 호출 |
| 인증 구현 | 📝 | JWT(업비트), HMAC-SHA512(Gate.io) |
| API 키 보안 저장 | 📝 | 암호화 스토리지 적용 |
| USDT→KRW 환산 | 📝 | 업비트 USDT/KRW 시세 기준 자동 환산 |
| 커스텀 훅 분리 | 📝 | hooks/ 디렉터리에 비즈니스 로직 정리 |
| 상태관리 도입 | 📝 | Context / Zustand 등 선정 |
| 에러/로딩 상태 처리 | 📝 | Skeleton, Error Boundary 등 |
| Gate.io 선물 | 📝 | 선물 포지션 조회 |
| 알림 | 📝 | 목표가, 수익률 도달 알림 |
| 백그라운드 동기화 | 📝 | 백그라운드 자산 갱신 |
| 테스트 확장 | 📝 | 컴포넌트/로직 단위 테스트 |

---

## 🔐 보안 원칙

- API Key / Secret 평문 저장 금지 (암호화 저장소 적용 예정)
- 민감 정보 로그 출력 금지
- HTTPS 통신만 허용
- 자동 매매 미지원 — **조회 전용 앱**

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
