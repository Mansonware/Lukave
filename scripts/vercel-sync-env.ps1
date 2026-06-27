$ErrorActionPreference = "Stop"

$envPath = ".env"

if (-Not (Test-Path $envPath)) {
    Write-Error "Arquivo .env local não encontrado!"
    exit 1
}

$dbUrl = ""
$directUrl = ""

foreach ($line in (Get-Content $envPath)) {
    if ($line -match "^DATABASE_URL=(.*)$") {
        $dbUrl = $matches[1].Trim(' "''')
    }
    if ($line -match "^DIRECT_URL=(.*)$") {
        $directUrl = $matches[1].Trim(' "''')
    }
}

if (-Not ($dbUrl -match "^postgresql://.*db\.uqtdxjsrtzqhshukunif\.supabase\.co.*$")) {
    Write-Error "DATABASE_URL inválida ou host incorreto."
    exit 1
}
if (-Not ($directUrl -match "^postgresql://.*db\.uqtdxjsrtzqhshukunif\.supabase\.co.*$")) {
    Write-Error "DIRECT_URL inválida ou host incorreto."
    exit 1
}

Write-Host "Variáveis validadas com sucesso. Removendo as antigas da Vercel..."

try {
    vercel env rm DATABASE_URL production -y | Out-Null
} catch {
    Write-Host "DATABASE_URL não existia ou falha silenciosa ao remover."
}
try {
    vercel env rm DIRECT_URL production -y | Out-Null
} catch {
    Write-Host "DIRECT_URL não existia ou falha silenciosa ao remover."
}

Write-Host "Adicionando DATABASE_URL e DIRECT_URL na Vercel..."
$dbUrl | vercel env add DATABASE_URL production
$directUrl | vercel env add DIRECT_URL production

Write-Host "Atualizando .env.vercel.production..."
vercel env pull .env.vercel.production --environment=production

Write-Host "Sincronização concluída."
