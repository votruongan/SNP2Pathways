
let pathway_filter = ['AGE-RAGE signaling pathway in diabetic complications', 
'Acute myeloid leukemia', 'African trypanosomiasis', 'Alcoholism', 'Allograft rejection', 
'Alzheimer disease', 'Amoebiasis', 'Amphetamine addiction', 'Amyotrophic lateral sclerosis (ALS)', 
'Antifolate resistance', 'Arrhythmogenic right ventricular cardiomyopathy (ARVC)', 'Asthma', 'Autoimmune thyroid disease', 
'Bacterial invasion of epithelial cells', 'Basal cell carcinoma', 'Bladder cancer', 'Breast cancer',
 'Central carbon metabolism in cancer', 'Chagas disease (American trypanosomiasis)', 'Chemical carcinogenesis', 
 'Choline metabolism in cancer', 'Chronic myeloid leukemia', 'Cocaine addiction', 'Colorectal cancer', 'Cushing syndrome',
  'Dilated cardiomyopathy (DCM)', 'EGFR tyrosine kinase inhibitor resistance', 'Endocrine resistance', 'Endometrial cancer',
   'Epithelial cell signaling in Helicobacter pylori infection', 'Epstein-Barr virus infection', 
   'Fluid shear stress and atherosclerosis', 'Gastric cancer', 'Glioma', 'Graft-versus-host disease',
    'Hepatitis B', 'Hepatitis C', 'Hepatocellular carcinoma', 'Herpes simplex virus 1 infection', 
    'Human T-cell leukemia virus 1 infection', 'Human cytomegalovirus infection', 'Human immunodeficiency virus 1 infection', 
    'Human papillomavirus infection', 'Huntington disease', 'Hypertrophic cardiomyopathy (HCM)', 
    'Inflammatory bowel disease (IBD)', 'Influenza A', 'Insulin resistance', 'Kaposi sarcoma-associated herpesvirus infection', 
    'Legionellosis', 'Leishmaniasis', 'Malaria', 'Maturity onset diabetes of the young', 'Measles', 'Melanoma', 'MicroRNAs in cancer', 'Morphine addiction', 'Nicotine addiction', 'Non-alcoholic fatty liver disease (NAFLD)', 'Non-small cell lung cancer', 'PD-L1 expression and PD-1 checkpoint pathway in cancer', 'Pancreatic cancer', 'Parkinson disease', 'Pathogenic Escherichia coli infection', 'Pathways in cancer', 'Pertussis', 'Platinum drug resistance', 'Primary immunodeficiency', 'Prion diseases', 'Prostate cancer', 'Proteoglycans in cancer', 'Renal cell carcinoma', 'Rheumatoid arthritis', 'Salmonella infection', 'Shigellosis', 'Small cell lung cancer', 'Spinocerebellar ataxia', 'Staphylococcus aureus infection', 'Systemic lupus erythematosus', 'Thyroid cancer', 'Toxoplasmosis', 'Transcriptional misregulation in cancer', 'Tuberculosis', 'Type I diabetes mellitus', 'Type II diabetes mellitus', 'Vibrio cholerae infection', 'Viral carcinogenesis', 'Viral myocarditis', 'Yersinia infection'];


function makeXHR(toSend,param=null){
    url = window.location.href+ toSend;
    if (param != null)
        url = url + "/" + param.toString();
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    return xhr;
}

function getEle(id){
    return document.getElementById(id);
}

