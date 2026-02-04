from classifier_model import MultiTaskRuBERT

inp = input()

model = MultiTaskRuBERT()
print(model.predict_samples([inp]))