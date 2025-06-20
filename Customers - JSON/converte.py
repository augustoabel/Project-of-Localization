import csv
import json
import os


caminho = r"C:\Users\augusto.abel\Desktop\Code\Project of Localization\Customers\dados.csv"

with open(caminho, newline='', encoding='utf-8') as csvfile:
    leitor = csv.DictReader(csvfile)
    dados = list(leitor)

with open("dados.json", "w", encoding="utf-8") as jsonfile:
    json.dump(dados, jsonfile, ensure_ascii=False, indent=2)
    
    

nome_json = os.path.splitext(os.path.basename(caminho))[0] + ".json"
destino = os.path.join(os.path.dirname(caminho), nome_json)

with open(destino, "w", encoding="utf-8") as jsonfile:
    json.dump(dados, jsonfile, ensure_ascii=False, indent=2)
print(f"✅ Arquivo salvo em: {destino}")

