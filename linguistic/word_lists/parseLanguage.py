import pandas as pd

# Step 1: Load the CSV file
input_file = 'common_french_words.csv'  # Change this to your input file name
output_file = 'common_french_words.csv'  # Output file name

df = pd.read_csv(input_file, header=None)

    # Step 2: Remove the middle row (index 1)
df = df.drop(columns=[2])

print(df)

    # Step 3: Save the result to a new CSV file
df.to_csv(output_file, index=False)

print(f'Middle row removed and output saved to {output_file}')