# 디페이(Dpay)
친구, 지인들과의 모임이나 여행 시 결제한 비용들을 입력하여 간편하게 정산할 수 있도록 돕는 
더치페이 서비스입니다. 
<br />
모임을 생성하여 멤버, 날짜, 사용한 비용을 입력하면 그 내용을 한눈에 확인할 수 있습니다. 
<br />
입력된 데이터를 바탕으로 정산 결과를 바로 확인할 수 있어 복잡한 정산 과정을 간소화하고 편리하게 비용 관리를 할 수 있는 웹 애플리케이션입니다.

<br />

➗ 배포한 사이트
<br />
https://dpay-two.vercel.app/

<br />
➗ 프로젝트 기간
<br />
2024.10.19 ~ 2024.11.23

<br />
➗ 개발 스택

- 빌드 : React.js
- 언어 : TypeScript
- 호스팅 : Vercel
- 데이터 & Autentication : supabase 
- 패키지매니저 : npm
- 라이브러리
  - 상태관리 : zustand
  - CSS 스타일링 : Styled-component
  - UI 컴포넌트 : Chakra UI
  - 테스트 : RTL + Jest

<br />

➗ 디렉토리 구조

```react
src
|-- assets
|-- components
|   |-- shared
|-- hooks
|-- pages
|   |-- CreateGroup.tsx
|   |-- ExpenseMain.tsx
|   |-- Home.tsx
|   |-- Login.tsx
|   |-- MyPage.tsx
|   |-- Signup.tsx
|-- store
|-- types   
|   |-- expense.ts
|   |-- formData.ts
|   |-- group.ts
|-- UI
```

<br />

___

### 기능구현

회원가입 

<img src='https://blog.kakaocdn.net/dn/oBnU6/btsKWbPuL4Y/xMQkFFMgWJHBS2MbV5STZ1/img.gif' alt='signup' />

- 그룹 생성 기능을 사용하기 위해서는 회원가입 필요
- supabase 인증 기능을 활용한 회원가입 진행
- 폼 유효성 검증을 통해 조건을 충족한 뒤 가입하기 버튼 클릭 시 가입완료

<br>

로그인

<img src='https://blog.kakaocdn.net/dn/mAYPe/btsKV10nnls/PZ1MtBgqxfBg11ze3j9ANk/img.gif' alt='login' />

<br>

그룹 생성

<img src='https://blog.kakaocdn.net/dn/6W4VU/btsKV9REZlw/sbkDVM6jx2LVNsfu9O3su1/img.gif' alt='create' />

- 모임 이름, 멤버, 날짜 입력 후 생성하기 버튼 클릭 시 그룹 생성

<br>

비용 입력

<img src='https://blog.kakaocdn.net/dn/65QPM/btsKWG9gLsO/amzMkviA63m8oiQmj1XmCk/img.gif' alt='expense' />

- 비용 입력 폼의 유효성 검증 조건에 맞게 입력
- 날짜, 비용 내용, 메모, 비용, 결제한 멤버 입력 후 추가하기 클릭 시 비용 리스트에 추가
- 비용 추가 할 때마다 정산 결과에 실시간 반영

<br>

비용 삭제 및 내보내기

<img src='https://blog.kakaocdn.net/dn/ceeoKe/btsKWQKKGyY/zzjK30P25N8hoWJm8lqftk/img.gif' alt='export' />

- 삭제 버튼 클릭 시 해당 비용 삭제
- 정산결과에 있는 내보내기 버튼 클릭 시 png 파일로 저장

<br>

공유하기

<img src='https://blog.kakaocdn.net/dn/mLcwk/btsKWabWQv8/noOjl4bwJCutaKkXiM7Je0/img.gif' alt='share' />

- 페이지 하단에 있는 공유 버튼 클릭 시 해당 그룹 url 클립보드에 저장
- url을 통해 해당 모임 멤버에게 모임 공유 가능 

<br>

마이페이지

<img src='https://blog.kakaocdn.net/dn/kwMMs/btsKUB2CePj/S4D1rYK1oi6J0qRUnMCE9K/img.gif' alt='mypage' />

- 마이페이지에서 회원 정보 확인 가능
- 마이페이지에 있는 모임 내역에서만 모임들 삭제 가능

<br>

___

💡 supabase를 통해 회원가입, 로그인, 데이터 저장 기능 구현
```tsx
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

<br>

💡 프로젝트에서 입력되는 상태들은 zustand를 사용해 관리
```tsx
import { create } from "zustand";

interface GroupState {
	groupName: string;
	tags: string[];
	startDate: string;
	endDate: string;
	setGroupName: (name: string) => void;
	addTag: (tag: string) => void;
	removeTag: (tag: string) => void;
	setTags: (tags: string[]) => void;
	setStartDate: (date: string) => void;
	setEndDate: (date: string) => void;
}

export const useGroupStore = create<GroupState>(set => ({
	groupName: "",
	tags: [],
	startDate: "",
	endDate: "",
	setGroupName: name => set({ groupName: name }),
	addTag: tag => set(state => ({ tags: [...state.tags, tag] })),
	removeTag: tagToRemove => set(state => ({ tags: state.tags.filter(tag => tag !== tagToRemove) })),
	setTags: (tags) => set({ tags }),
	setStartDate: date => set({ startDate: date }),
	setEndDate: date => set({ endDate: date }),
}));
```

<br>

💡 html-to-image 라이브러리를 사용해 이미지 내보내기 구현
```tsx
const exportToImage = () => {
		if (wrapperElement.current === null) {
			return;
		}

		toPng(wrapperElement.current, {
			filter: node => node.tagName !== "BUTTON",
		})
			.then(dataURL => {
				const link = document.createElement("a");
				link.href = dataURL;
				link.download = "settlement-summary.png";
				link.click();
			})
			.catch(err => {
				console.error("이미지를 다운로드하는 중 오류가 발생했습니다:", err);
			});
	};
```

<br>

💡 웹에서 제공하는 Web Share API를 활용한 공유 기능 구현
```tsx
	const handleSharing = () => {
		if (navigator.userAgent.match(/iphone|android/i) && navigator.share) {
			navigator.share({
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href).then(() => {
				alert("공유 링크가 클립 보드에 복사 되었습니다.");
			});
		}
	};
```

<br>

___







