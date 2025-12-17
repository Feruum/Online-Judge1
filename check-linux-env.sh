#!/bin/bash

echo "🔍 Проверка Linux окружения для Online Judge..."
echo

# Check OS
echo "📋 Информация о системе:"
uname -a
echo

# Check Docker
echo "🐳 Проверка Docker:"
if command -v docker &> /dev/null; then
    echo "✅ Docker установлен: $(docker --version)"
    if docker info &> /dev/null; then
        echo "✅ Docker запущен"
    else
        echo "❌ Docker не запущен"
        echo "   Запустите: sudo systemctl start docker"
        exit 1
    fi
else
    echo "❌ Docker не установлен"
    echo "   Установите: sudo apt install docker.io"
    exit 1
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose установлен: $(docker-compose --version)"
else
    echo "❌ Docker Compose не установлен"
    echo "   Установите: sudo apt install docker-compose"
    exit 1
fi

# Check Node.js
echo
echo "📦 Проверка Node.js:"
if command -v node &> /dev/null; then
    echo "✅ Node.js установлен: $(node --version)"
else
    echo "❌ Node.js не установлен"
    echo "   Установите: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm установлен: $(npm --version)"
else
    echo "❌ npm не установлен"
    exit 1
fi

# Check Git
echo
echo "📚 Проверка Git:"
if command -v git &> /dev/null; then
    echo "✅ Git установлен: $(git --version)"
else
    echo "❌ Git не установлен"
    echo "   Установите: sudo apt install git"
    exit 1
fi

# Check required ports
echo
echo "🔌 Проверка доступности портов:"
ports=(5432 6379 2358 3000)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Порт $port занят"
    else
        echo "✅ Порт $port свободен"
    fi
done

echo
echo "🎯 Окружение готово к развертыванию Online Judge!"
echo
echo "🚀 Для запуска выполните:"
echo "   chmod +x start.sh"
echo "   ./start.sh"
