# --- Aşama 1: Projeyi Derleme (Build Stage) ---
# Java 21 ve Maven içeren, çoklu mimari destekli resmi bir temel imaj kullanıyoruz.
# Bu imaj hem Intel (amd64) hem de Apple Silicon (arm64) üzerinde doğal (native) çalışır.
FROM maven:3.9-eclipse-temurin-21 AS build

# Build context = backend/ (deploy-backend.yml workflow ile uyumlu).
# api-gateway standalone Spring Boot modülü; common-auth bağımlılığı YOK.
# Path'ler context'e göre relatif: backend/api-gateway/...
WORKDIR /app

# Önce sadece pom.xml'i kopyalayıp bağımlılıkları indiriyoruz (Docker cache).
COPY api-gateway/pom.xml ./api-gateway/pom.xml
RUN mvn -f api-gateway/pom.xml dependency:go-offline

# Şimdi tüm proje kaynak kodunu kopyalıyoruz.
COPY api-gateway/src ./api-gateway/src

# Maven ile projeyi derleyip çalıştırılabilir JAR dosyasını oluşturuyoruz.
# Testleri atlayarak süreci hızlandırıyoruz.
RUN mvn -f api-gateway/pom.xml clean package -DskipTests


# --- Aşama 2: Çalıştırma İmajı (Runtime Stage) ---
# Sadece Java Runtime içeren, daha küçük, güvenli ve çoklu mimari destekli bir imaj kullanıyoruz.
# 'jammy' etiketi, Ubuntu 22.04 (Jammy Jellyfish) tabanlı olduğunu belirtir ve stabil bir seçenektir.
FROM eclipse-temurin:21-jre-jammy

# D14: non-root user
RUN groupadd --gid 1000 --system app \
    && useradd  --uid 1000 --gid 1000 --system --shell /usr/sbin/nologin app

WORKDIR /app

COPY --from=build /app/api-gateway/target/*.jar app.jar
RUN chown app:app app.jar

EXPOSE 8080 8081

USER 1000:1000

ENTRYPOINT ["java", "-jar", "app.jar"]
