document.addEventListener('DOMContentLoaded', function() {
    // API URL과 API Key 정의
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const API_KEY = "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";

    // 1. 사용할 DOM 선언하기 : getElementById, querySelector
    const chatlog = document.getElementById('chat-log'); // 채팅 로그
    const userInput = document.getElementById('user-input'); // 사용자 입력 필드
    const sendButton = document.getElementById('send-button'); // 전송 버튼
    const info = document.querySelector('.info'); // 추가적인 정보 표시 영역 (선택자 수정 필요 시 사용)

    // 2. #send-button 버튼 클릭 시 이벤트 추가하기 : addEventListener
    sendButton.addEventListener('click', sendMessage);

    // Enter 키로 메시지 전송
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 3. sendMessage() 함수 정의하기
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        appendMessage('user', message); // 사용자 메시지 추가
        userInput.value = ''; // 입력 필드 초기화

        // ChatGPT API 호출
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = data.choices[0].message.content; // 봇의 응답 메시지 가져오기
            appendMessage('bot', botMessage);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage('bot', '오류가 발생했습니다. 다시 시도해 주세요.');
        });
    }

    // 4. appendMessage() 함수 정의하기
    function appendMessage(sender, message) {
        if (info) info.style.display = 'none'; // 정보 표시 영역 숨김

        const chatElement = document.createElement('div');
        const messageElement = document.createElement('div');
        const iconElement = document.createElement('div');
        const icon = document.createElement('i');

        chatElement.classList.add('chat-box');
        iconElement.classList.add('icon');
        messageElement.classList.add(sender);
        messageElement.innerText = message;

        if (sender === 'user') {
            icon.classList.add('fa-regular', 'fa-user');
            iconElement.setAttribute('id', 'user-icon');
        } else {
            icon.classList.add('fa-solid', 'fa-robot');
            iconElement.setAttribute('id', 'bot-icon');
        }

        iconElement.appendChild(icon);
        chatElement.appendChild(iconElement);
        chatElement.appendChild(messageElement);
        chatlog.appendChild(chatElement);
    }
});
