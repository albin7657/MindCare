const https = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/domains/questions-by-domains/Stress,Anxiety',
    method: 'GET'
};

const req = https.request(options, res => {
    let data = '';

    res.on('data', chunk => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const questions = JSON.parse(data);
            console.log('Successfully fetched', questions.length, 'questions');
            questions.forEach((q, i) => {
                console.log('Q' + (i + 1) + ':', q.question_text.substring(0, 30) + '...', 'Options:', q.options.length);
            });
            console.log('✅ Verification passed: Questions fetched correctly.');
        } else {
            console.error('❌ Verification failed:', res.statusCode, data);
        }
    });
});

req.on('error', error => {
    console.error('❌ Verification error:', error.message);
});

req.end();
