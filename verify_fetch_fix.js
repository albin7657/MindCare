import fetch from 'node-fetch';

async function verify() {
    try {
        const res = await fetch('http://localhost:5000/api/domains/questions-by-domains/Stress,Anxiety');
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`API request failed: ${res.status} ${JSON.stringify(errorData)}`);
        }
        const questions = await res.json();
        console.log('Successfully fetched', questions.length, 'questions');
        questions.forEach((q, i) => {
            console.log('Q' + (i + 1) + ':', q.question_text.substring(0, 30) + '...', 'Options:', q.options.length);
        });
        console.log('✅ Verification passed: Questions fetched correctly.');
    } catch (err) {
        console.error('❌ Verification failed:', err.message);
    }
}

verify();
