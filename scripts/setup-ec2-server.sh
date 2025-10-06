#!/bin/bash

# EC2 서버 초기 설정 자동화 스크립트
# 사용법: EC2 인스턴스에 로그인한 후 실행
# curl -O https://raw.githubusercontent.com/greensea-lab/green-shipping-ai-web/main/scripts/setup-ec2-server.sh
# chmod +x setup-ec2-server.sh
# ./setup-ec2-server.sh

set -e

echo "================================================"
echo "🚀 EC2 서버 초기 설정 시작"
echo "================================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 시스템 업데이트
echo -e "${BLUE}📦 1단계: 시스템 업데이트...${NC}"
sudo apt update -y
sudo apt upgrade -y
echo -e "${GREEN}✅ 시스템 업데이트 완료${NC}\n"

# 2. Nginx 설치
echo -e "${BLUE}🌐 2단계: Nginx 설치...${NC}"
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
echo -e "${GREEN}✅ Nginx 설치 완료${NC}\n"

# 3. 기본 도구 설치
echo -e "${BLUE}🔧 3단계: 기본 도구 설치...${NC}"
sudo apt install -y curl wget git unzip htop
echo -e "${GREEN}✅ 기본 도구 설치 완료${NC}\n"

# 4. 디렉토리 생성
echo -e "${BLUE}📁 4단계: 배포 디렉토리 생성...${NC}"
sudo mkdir -p /var/www/green-shipping-ai-web
mkdir -p /home/ubuntu/app
mkdir -p /tmp/green-shipping-deploy
sudo chown -R www-data:www-data /var/www/green-shipping-ai-web
sudo chmod -R 755 /var/www/green-shipping-ai-web
echo -e "${GREEN}✅ 디렉토리 생성 완료${NC}\n"

# 5. Nginx 설정
echo -e "${BLUE}⚙️  5단계: Nginx 설정...${NC}"

# 백업 생성
if [ -f "/etc/nginx/sites-available/green-shipping-ai-web" ]; then
    sudo cp /etc/nginx/sites-available/green-shipping-ai-web /etc/nginx/sites-available/green-shipping-ai-web.backup
fi

# Nginx 설정 파일 생성
sudo tee /etc/nginx/sites-available/green-shipping-ai-web > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /var/www/green-shipping-ai-web;
    index index.html;
    
    # 로그 설정
    access_log /var/log/nginx/green-shipping-access.log;
    error_log /var/log/nginx/green-shipping-error.log;
    
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # React Router 지원
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # index.html은 캐싱 안 함
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }
    
    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 숨김 파일 접근 차단
    location ~ /\. {
        deny all;
    }
}
EOF

# 심볼릭 링크 생성
sudo ln -sf /etc/nginx/sites-available/green-shipping-ai-web /etc/nginx/sites-enabled/

# 기본 사이트 비활성화
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx

echo -e "${GREEN}✅ Nginx 설정 완료${NC}\n"

# 6. 방화벽 설정
echo -e "${BLUE}🔒 6단계: 방화벽(UFW) 설정...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo -e "${GREEN}✅ 방화벽 설정 완료${NC}\n"

# 7. 테스트 페이지 생성
echo -e "${BLUE}🧪 7단계: 테스트 페이지 생성...${NC}"
sudo tee /var/www/green-shipping-ai-web/index.html > /dev/null <<'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Green Shipping AI - 배포 준비 완료</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin: 1rem 0; opacity: 0.9; }
        .status { 
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: #10b981;
            border-radius: 50px;
            font-weight: bold;
            margin: 1rem 0;
        }
        .info {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Green Shipping AI</h1>
        <div class="status">✅ EC2 서버 준비 완료</div>
        <p>서버 설정이 완료되었습니다!</p>
        <p>이제 GitHub Actions를 통해 배포를 시작하세요.</p>
        <div class="info">
            <strong>다음 단계:</strong><br>
            1. GitHub Secrets 설정<br>
            2. main 브랜치에 push<br>
            3. 자동 배포 시작!
        </div>
    </div>
</body>
</html>
EOF
echo -e "${GREEN}✅ 테스트 페이지 생성 완료${NC}\n"

# 8. 백업 스크립트 생성
echo -e "${BLUE}💾 8단계: 자동 백업 스크립트 생성...${NC}"
mkdir -p /home/ubuntu/backups

tee /home/ubuntu/backup.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/web-backup-$DATE.tar.gz /var/www/green-shipping-ai-web 2>/dev/null
find $BACKUP_DIR -name "web-backup-*.tar.gz" -mtime +7 -delete
echo "Backup completed: $DATE"
EOF

chmod +x /home/ubuntu/backup.sh
echo -e "${GREEN}✅ 백업 스크립트 생성 완료${NC}\n"

# 9. 시스템 정보 출력
echo -e "${BLUE}📊 9단계: 시스템 정보...${NC}"
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo -e "퍼블릭 IP: ${GREEN}$PUBLIC_IP${NC}"
echo -e "Nginx 상태: ${GREEN}$(sudo systemctl is-active nginx)${NC}"
echo -e "디스크 사용량:"
df -h /
echo ""

# 10. 완료
echo "================================================"
echo -e "${GREEN}🎉 EC2 서버 초기 설정 완료!${NC}"
echo "================================================"
echo ""
echo "✅ 완료된 작업:"
echo "  - 시스템 업데이트"
echo "  - Nginx 설치 및 설정"
echo "  - 방화벽 설정"
echo "  - 배포 디렉토리 생성"
echo "  - 테스트 페이지 생성"
echo ""
echo "🌐 웹사이트 확인:"
echo "  http://$PUBLIC_IP"
echo ""
echo "📋 다음 단계:"
echo "  1. GitHub Secrets 설정 (AWS_EC2_DEPLOYMENT_GUIDE.md 참고)"
echo "  2. GitHub Actions 워크플로우 실행"
echo "  3. 배포 완료 후 웹사이트 확인"
echo ""
echo "📚 자세한 가이드: AWS_EC2_DEPLOYMENT_GUIDE.md"
echo ""
