# 🎓 Predicting Student Mental Health Score from Social Media Usage

An end-to-end Machine Learning project that predicts a student's **Mental Health Score** based on social media usage, study habits, sleep, physical activity, stress level, and demographic information.

The project combines **Machine Learning, FastAPI, and React** to transform a trained regression model into an interactive web application.

---

## 📌 Project Overview

Students' mental health can be influenced by several lifestyle and digital-behavior factors such as:

* Social media usage
* Daily device/app unlocks
* Study hours
* Sleep duration
* Physical activity
* Stress level
* Academic level
* Most-used social media platform
* Purpose of social media usage
* Demographic information

This project uses these factors to predict a student's:

> **Mental Health Score**

The target variable, `Mental_Health_Score`, is a continuous numerical value ranging approximately from **3 to 10**. Therefore, this is a **Regression Problem**.

The project follows a complete machine learning workflow:

```text
Data Collection
      ↓
Data Understanding
      ↓
Data Cleaning
      ↓
Exploratory Data Analysis
      ↓
Feature Engineering
      ↓
Feature Encoding
      ↓
Train-Test Split
      ↓
Preprocessing Pipeline
      ↓
Model Training
      ↓
Model Comparison
      ↓
Hyperparameter Tuning
      ↓
Model Evaluation
      ↓
Model Saving
      ↓
FastAPI Backend
      ↓
React Frontend
      ↓
Prediction
```

---

# 🎯 Project Objectives

The main objectives of this project are:

* Analyze the relationship between social media usage and student mental health.
* Understand the structure and quality of the dataset.
* Perform Exploratory Data Analysis (EDA).
* Detect missing values and duplicate records.
* Identify and correct unrealistic data values.
* Analyze numerical feature distributions and skewness.
* Engineer meaningful features.
* Handle high-cardinality categorical variables.
* Apply appropriate encoding techniques.
* Build reusable preprocessing pipelines.
* Compare Linear Regression and Random Forest Regression.
* Perform Random Forest hyperparameter tuning.
* Evaluate models using R², MAE, and RMSE.
* Save the complete machine learning pipeline.
* Expose the model through a FastAPI REST API.
* Build a React frontend for user interaction.
* Create an end-to-end ML prediction application.

---

# 📊 Dataset

The project uses the following dataset:

```text
Student Social Media And Mental Health Impact.csv
```

The dataset contains information about **5,000 students** and **13 columns**.

## Dataset Dimensions

```text
Rows    : 5,000
Columns : 13
```

---

# 🗂️ Dataset Features

| Feature                   | Description                                | Type                |
| ------------------------- | ------------------------------------------ | ------------------- |
| `Age`                     | Student's age                              | Numerical           |
| `Gender`                  | Student's gender                           | Categorical         |
| `Country`                 | Student's country                          | Categorical         |
| `Academic_Level`          | Academic level of the student              | Categorical         |
| `Most_Used_Platform`      | Most frequently used social media platform | Categorical         |
| `Purpose_Of_Use`          | Main purpose of social media usage         | Categorical         |
| `Avg_Daily_Usage_Hours`   | Average daily social media usage in hours  | Numerical           |
| `Daily_Unlocks`           | Number of daily device/app unlocks         | Numerical           |
| `Study_Hours`             | Daily study hours                          | Numerical           |
| `Physical_Activity_Hours` | Daily physical activity hours              | Numerical           |
| `Sleep_Hours_Per_Night`   | Average sleep duration per night           | Numerical           |
| `Stress_Level`            | Student's stress level                     | Ordinal Categorical |
| `Mental_Health_Score`     | Target variable to be predicted            | Numerical           |

---

# 🔍 Data Understanding

The dataset was initially loaded using Pandas.

```python
import pandas as pd

df = pd.read_csv(
    'Student Social Media And Mental Health Impact.csv'
)
```

The dataset was then inspected using:

```python
df.shape
df.head()
df.info()
df.describe()
```

## Dataset Shape

```text
(5000, 13)
```

This means the dataset contains:

* 5,000 rows
* 13 columns

---

# 📋 Initial Data Summary

The numerical variables were summarized using `df.describe()`.

Some important statistics are:

| Feature                 |   Mean |  Min | Max |
| ----------------------- | -----: | ---: | --: |
| Age                     |  20.82 |   18 |  24 |
| Avg_Daily_Usage_Hours   |   5.08 |  1.0 | 8.8 |
| Daily_Unlocks           | 171.45 |   62 | 273 |
| Study_Hours             |   3.01 |  0.3 | 8.3 |
| Physical_Activity_Hours |   1.75 | -0.4 | 4.1 |
| Sleep_Hours_Per_Night   |   6.63 |  3.6 | 9.9 |
| Mental_Health_Score     |   6.23 |  3.6 | 9.4 |

One unusual value was identified in:

```text
Physical_Activity_Hours
```

The minimum value was:

```text
-0.4
```

Since negative physical activity hours are not physically meaningful, this was treated as an invalid value during data cleaning.

---

# 🧹 Data Cleaning

The dataset was checked for:

* Missing values
* Duplicate rows
* Invalid values
* Outliers
* Data types
* Skewness

The goal was to clean the data without unnecessarily removing useful observations.

---

## 1. Missing Value Check

Missing values were checked using:

```python
df.isnull().sum()
```

The result showed:

```text
All columns = 0 missing values
```

Therefore, there were no missing values in the dataset.

Even though the current dataset has no missing values, imputation is included later in the preprocessing pipeline as a safety measure for future or real-world data.

---

## 2. Duplicate Check

Duplicate rows were checked using:

```python
df.duplicated().sum()
```

The result was:

```text
2
```

Therefore, two duplicate rows were found.

The duplicate rows were removed using:

```python
df = df.drop_duplicates()
```

---

## 3. Invalid Physical Activity Values

The `Physical_Activity_Hours` column contained negative values.

For example:

```text
Minimum = -0.4
```

Negative hours are not physically possible, so the invalid values were corrected using:

```python
df['Physical_Activity_Hours'] = \
    df['Physical_Activity_Hours'].clip(lower=0)
```

### Why use `clip(lower=0)`?

Instead of deleting the entire row, the invalid value is converted to the nearest realistic value:

```text
-0.4 → 0
```

The rest of the student's information remains available for model training.

This avoids unnecessarily losing useful data.

---

# 📊 Exploratory Data Analysis

Exploratory Data Analysis was performed to understand the dataset and investigate relationships between important features and the target variable.

The analysis was kept focused around specific questions rather than generating unnecessary visualizations.

---

# 4.1 Distribution of Mental Health Score

The distribution of the target variable was visualized using a histogram with KDE.

```python
sns.histplot(
    df['Mental_Health_Score'],
    kde=True
)
```

### Purpose

This helps understand:

* The range of mental health scores.
* The central tendency.
* The distribution shape.
* Whether the target has extreme values.
* Whether the target is approximately symmetric.

---

# 4.2 Correlation Heatmap

A correlation heatmap was used to understand relationships between numerical variables.

```python
sns.heatmap(
    df.corr(numeric_only=True),
    annot=True
)
```

### Purpose

The correlation matrix helps identify:

* Positive relationships.
* Negative relationships.
* Weak relationships.
* Strong relationships.
* Relationships between numerical features and `Mental_Health_Score`.

---

# 4.3 Stress Level vs Mental Health Score

The relationship between stress level and mental health score was analyzed using a box plot.

The stress categories were:

```text
Low
Medium
High
Very High
```

The order was explicitly defined:

```python
order = [
    'Low',
    'Medium',
    'High',
    'Very High'
]
```

The visualization was created using:

```python
sns.boxplot(
    x='Stress_Level',
    y='Mental_Health_Score',
    data=df,
    order=order
)
```

### Observation

The analysis showed a clear relationship between stress level and mental health score, with higher stress levels generally associated with lower mental health scores.

This also supports treating `Stress_Level` as an **ordinal feature** rather than a purely nominal category.

---

# 4.4 Daily Social Media Usage vs Mental Health Score

A scatter plot was used to analyze the relationship between:

```text
Avg_Daily_Usage_Hours
```

and:

```text
Mental_Health_Score
```

```python
sns.scatterplot(
    x='Avg_Daily_Usage_Hours',
    y='Mental_Health_Score',
    data=df
)
```

### Purpose

This visualization helps determine whether increased social media usage is associated with changes in mental health score.

It also helps identify whether the relationship appears linear or potentially nonlinear.

---

# 4.5 Sleep Hours vs Mental Health Score

Sleep duration was compared with mental health score.

```python
sns.scatterplot(
    x='Sleep_Hours_Per_Night',
    y='Mental_Health_Score',
    data=df
)
```

### Purpose

Sleep is an important lifestyle variable, so this visualization was used to investigate whether sleep duration is related to mental health score in the dataset.

---

# 4.6 Most Used Social Media Platform

The frequency of each social media platform was analyzed using:

```python
df['Most_Used_Platform'].value_counts()
```

The platform distribution was:

| Platform  | Count |
| --------- | ----: |
| Instagram |  1130 |
| TikTok    |   918 |
| Facebook  |   719 |
| LinkedIn  |   523 |
| YouTube   |   491 |
| Twitter   |   462 |
| Snapchat  |   420 |
| WhatsApp  |   175 |
| LINE      |    50 |
| VKontakte |    40 |
| KakaoTalk |    36 |
| WeChat    |    36 |

A count plot was also created to visualize the distribution.

```python
plt.figure(figsize=(8, 4))

sns.countplot(
    x=df['Most_Used_Platform'],
    order=df['Most_Used_Platform'].value_counts().index
)
```

---

# 🔎 Outlier Detection

Numerical features were checked for outliers using the **Interquartile Range (IQR)** method.

```python
num_features = df.select_dtypes(
    include='number'
)

Q1 = num_features.quantile(0.25)
Q3 = num_features.quantile(0.75)

IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = (
    (num_features < lower_bound) |
    (num_features > upper_bound)
)

print(outliers.sum())
```

The detected outliers were:

| Feature                 | Number of Outliers |
| ----------------------- | -----------------: |
| Age                     |                  0 |
| Avg_Daily_Usage_Hours   |                  0 |
| Daily_Unlocks           |                  0 |
| Study_Hours             |                  2 |
| Physical_Activity_Hours |                 22 |
| Sleep_Hours_Per_Night   |                  0 |
| Mental_Health_Score     |                  0 |

The outlier analysis was used as an inspection step rather than automatically deleting observations.

---

# 📈 Skewness Analysis

Skewness measures how asymmetric a numerical distribution is.

A skewness value close to zero generally indicates a relatively symmetric distribution.

The skewness values were:

| Feature                 | Skewness |
| ----------------------- | -------: |
| Age                     |   0.1550 |
| Avg_Daily_Usage_Hours   |   0.0056 |
| Daily_Unlocks           |   0.0023 |
| Study_Hours             |   0.4361 |
| Physical_Activity_Hours |   0.0533 |
| Sleep_Hours_Per_Night   |   0.1239 |
| Mental_Health_Score     |   0.2071 |

`Study_Hours` had the highest positive skewness among the predictor variables.

Therefore, a log transformation was applied to `Study_Hours`.

---

# 🛠️ Feature Engineering

One meaningful feature-engineering step was performed on the `Country` feature.

## Country Grouping

The original `Country` column contained:

```text
111 unique values
```

Directly applying one-hot encoding to all 111 countries would create a large number of categorical features, many of which would contain relatively few observations.

Instead, the top 10 most frequent countries were retained individually and all remaining countries were grouped into:

```text
Other
```

The transformation was:

```python
top_countries = (
    df['Country']
    .value_counts()
    .index[:10]
    .tolist()
)

def group_countries(country):
    if country in top_countries:
        return country
    else:
        return 'Other'

df['Grouped_country'] = (
    df['Country']
    .apply(group_countries)
)
```

The resulting categories were:

```text
Other
India
USA
Canada
Australia
UK
Germany
Mexico
Turkey
France
```

This reduced the country feature from:

```text
111 categories
```

to:

```text
11 categories
```

This helps keep the categorical feature space manageable while retaining the information from the most frequent countries.

---

# 🔤 Encoding Strategy

Different categorical variables require different encoding techniques.

The encoding strategy was designed according to the meaning of each feature.

---

## Ordinal Encoding

`Stress_Level` has a meaningful order:

```text
Low < Medium < High < Very High
```

Therefore, ordinal encoding was used.

The mapping is:

```text
Low       → 0
Medium    → 1
High      → 2
Very High → 3
```

This preserves the natural order of the stress categories.

---

## One-Hot Encoding

The following features do not have a natural numerical order:

* `Gender`
* `Academic_Level`
* `Most_Used_Platform`
* `Purpose_Of_Use`
* `Grouped_country`

Therefore, One-Hot Encoding was used.

For example, instead of assigning:

```text
Instagram = 1
Facebook  = 2
YouTube   = 3
```

One-Hot Encoding creates separate binary features.

This prevents the model from assuming that one category is mathematically greater than another.

---

# ✂️ Train-Test Split

The dataset was split into training and testing sets using:

```python
from sklearn.model_selection import train_test_split
```

The split used was:

```text
70% Training
30% Testing
```

The code was:

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)
```

With approximately 5,000 records, around:

```text
70% → Training data
30% → Testing data
```

The test dataset remains unseen during model training.

### Why split the data?

If the model is evaluated on the same data used for training, it may appear to perform extremely well simply because it has already seen those examples.

A separate test set provides a better estimate of how the model generalizes to unseen data.

---

# 🔐 Avoiding Data Leakage

The train-test split was performed **before fitting the preprocessing transformations**.

The preprocessing pipeline is fitted only using the training data.

The test data is then transformed using the already-fitted preprocessing pipeline.

This prevents information from the test dataset from influencing the training process.

---

# ⚙️ Preprocessing with ColumnTransformer

Different feature groups require different preprocessing techniques.

A `ColumnTransformer` was used to combine all preprocessing operations into one reusable object.

The feature groups were:

```text
Skewed Numerical:
    Study_Hours

Other Numerical:
    Age
    Avg_Daily_Usage_Hours
    Daily_Unlocks
    Physical_Activity_Hours
    Sleep_Hours_Per_Night

Ordinal:
    Stress_Level

Nominal:
    Gender
    Academic_Level
    Most_Used_Platform
    Purpose_Of_Use
    Grouped_country
```

---

## Skewed Numerical Pipeline

`Study_Hours` was transformed using `log1p` and then scaled.

```python
skew_pipeline = Pipeline(
    steps=[
        (
            'log_transform',
            FunctionTransformer(np.log1p)
        ),
        (
            'scale',
            StandardScaler()
        )
    ]
)
```

---

## Numerical Pipeline

The remaining numerical features were scaled using:

```python
plain_numeric_pipeline = Pipeline(
    steps=[
        (
            'scale',
            StandardScaler()
        )
    ]
)
```

---

## Ordinal Pipeline

`Stress_Level` was encoded using an explicit category order.

```python
ordinal_pipeline = Pipeline(
    steps=[
        (
            'encode',
            OrdinalEncoder(
                categories=[
                    [
                        'Low',
                        'Medium',
                        'High',
                        'Very High'
                    ]
                ]
            )
        )
    ]
)
```

---

## Nominal Pipeline

Nominal categorical variables were encoded using:

```python
nominal_pipeline = Pipeline(
    steps=[
        (
            'encode',
            OneHotEncoder(
                handle_unknown='ignore'
            )
        )
    ]
)
```

The `handle_unknown='ignore'` option is especially useful when the API receives a category that was not present in the training data.

---

# 🔗 Complete ColumnTransformer

All preprocessing pipelines were combined using:

```python
preprocessor = ColumnTransformer(
    transformers=[
        (
            "Skewed_Pipeline",
            skew_pipeline,
            skwewd_col
        ),
        (
            "Plain_Numeric",
            plain_numeric_pipeline,
            other_numeric_cols
        ),
        (
            "Ordinal",
            ordinal_pipeline,
            ordinal_col
        ),
        (
            "Normal",
            nominal_pipeline,
            normal_col
        )
    ]
)
```

This means that the correct preprocessing is automatically applied to each feature group.

---

# 🔄 Why Use a Pipeline?

A Scikit-learn `Pipeline` combines preprocessing and model training into one object.

Instead of manually doing:

```text
Transform data
      ↓
Encode data
      ↓
Scale data
      ↓
Train model
```

the complete pipeline performs the required operations automatically.

For a new prediction:

```text
Raw User Input
      ↓
Same Preprocessing
      ↓
Same Encoding
      ↓
Same Scaling
      ↓
Model Prediction
```

This is especially important when deploying the model through FastAPI.

The backend does not need to manually recreate the preprocessing logic.

---

# 🤖 Model Building

Two regression algorithms were compared:

1. Linear Regression
2. Random Forest Regressor

The goal was to establish a simple baseline and then compare it with a nonlinear ensemble model.

---

# 1️⃣ Linear Regression

Linear Regression was used as the baseline model.

The complete pipeline was:

```python
lr_pipeline = Pipeline(
    steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ]
)
```

The model was trained using:

```python
lr_pipeline.fit(
    X_train,
    y_train
)
```

Predictions were generated using:

```python
lr_preds = lr_pipeline.predict(
    X_test
)
```

---

## Linear Regression Results

```text
Training R² : 0.723677
Testing R²  : 0.739794
MAE         : 0.536178
RMSE        : 0.676032
```

The test R² of approximately **0.74** indicates that the model explains a substantial portion of the variation in the target, but there is still room for improvement.

---

# 2️⃣ Random Forest Regressor

Random Forest was selected as the second model because the relationship between social media usage, lifestyle factors, and mental health may contain nonlinear patterns.

The pipeline was:

```python
rf_pipeline = Pipeline(
    steps=[
        ('preprocessor', preprocessor),
        (
            'random forest',
            RandomForestRegressor(
                random_state=42
            )
        )
    ]
)
```

The model was trained using:

```python
rf_pipeline.fit(
    X_train,
    y_train
)
```

Predictions were generated using:

```python
rf_preds = rf_pipeline.predict(
    X_test
)
```

---

## Random Forest Results

```text
Training R² : 0.980829
Testing R²  : 0.877589
MAE         : 0.347221
RMSE        : 0.463681
```

The Random Forest significantly outperformed the Linear Regression baseline on the test dataset.

---

# 🎛️ Hyperparameter Tuning

After training the default Random Forest model, hyperparameter tuning was performed using:

```text
RandomizedSearchCV
```

Randomized Search was selected instead of an exhaustive Grid Search because it tests a selected number of parameter combinations and can be more computationally efficient.

---

## Parameters Tuned

The following parameters were explored:

```python
param_grid = {
    'random forest__n_estimators': [
        100,
        200,
        300
    ],

    'random forest__max_depth': [
        5,
        10,
        15
    ],

    'random forest__min_samples_split': [
        2,
        5,
        10
    ],

    'random forest__min_samples_leaf': [
        1,
        2,
        4
    ]
}
```

---

## RandomizedSearchCV Configuration

```python
random_search = RandomizedSearchCV(
    estimator=rf_pipeline,
    param_distributions=param_grid,
    n_iter=15,
    cv=5,
    scoring='r2',
    random_state=42,
    n_jobs=-1
)
```

The search used:

```text
Number of combinations tested : 15
Cross-validation folds        : 5
Scoring metric                : R²
Parallel processing           : Enabled
```

---

# 🏆 Best Hyperparameters

The best hyperparameters found were:

```text
n_estimators       = 200
min_samples_split  = 5
min_samples_leaf   = 2
max_depth          = 15
```

The best estimator was obtained using:

```python
rf_best_pipeline = random_search.best_estimator_
```

---

# 📉 Tuned Random Forest Results

The tuned Random Forest achieved:

```text
Testing R² : 0.865014
MAE        : 0.368902
RMSE       : 0.486915
```

Interestingly, the tuned Random Forest performed slightly worse on the final untouched test set than the default Random Forest.

Therefore, the **default Random Forest pipeline** was retained as the deployed model.

---

# 📈 Model Evaluation

Three primary regression metrics were used.

---

## R² Score

**R² (Coefficient of Determination)** measures how much of the variation in the target variable is explained by the model.

A value closer to `1` generally indicates better predictive performance.

For example:

```text
R² = 0.88
```

means the model explains approximately 88% of the variation in the target on that evaluation dataset.

---

## MAE

**MAE (Mean Absolute Error)** measures the average absolute difference between the actual and predicted values.

For example:

```text
MAE = 0.35
```

means that the model's predictions are off by approximately 0.35 score points on average.

MAE is easy to interpret because it remains in the same units as the target variable.

---

## RMSE

**RMSE (Root Mean Squared Error)** is similar to MAE but gives greater weight to larger prediction errors.

A lower RMSE indicates better performance.

---

# 📊 Final Model Comparison

| Model                   | Training R² | Testing R² |        MAE |       RMSE |
| ----------------------- | ----------: | ---------: | ---------: | ---------: |
| Linear Regression       |      0.7237 |     0.7398 |     0.5362 |     0.6760 |
| Random Forest (Default) |  **0.9808** | **0.8776** | **0.3472** | **0.4637** |
| Random Forest (Tuned)   |      0.9547 |     0.8650 |     0.3689 |     0.4869 |

---

# 🏅 Final Model Selection

The **Default Random Forest Regressor** was selected as the final deployed model.

### Why?

Compared with Linear Regression, the default Random Forest achieved:

* Higher test R²
* Lower MAE
* Lower RMSE

It achieved:

```text
R²   = 0.8776
MAE  = 0.3472
RMSE = 0.4637
```

The tuned Random Forest did not outperform the default Random Forest on the untouched test set, so the default model was retained for deployment.

---

# 💾 Model Saving

The complete Random Forest pipeline was saved using Joblib.

```python
import joblib

joblib.dump(
    rf_pipeline,
    'Mental_Health_Model.pkl'
)
```

The saved file is:

```text
Mental_Health_Model.pkl
```

---

# 🔐 Why Save the Complete Pipeline?

The complete preprocessing and model pipeline was saved rather than saving only the Random Forest model.

The pipeline contains:

```text
Preprocessing
     +
Random Forest Model
```

Therefore, when a new user submits raw data through the API, the backend can pass the raw input directly to the saved pipeline.

The pipeline automatically performs:

```text
Raw Input
    ↓
Feature Transformation
    ↓
Encoding
    ↓
Scaling
    ↓
Random Forest Prediction
    ↓
Mental Health Score
```

This reduces the possibility of preprocessing inconsistencies between training and deployment.

---

# 🚀 FastAPI Backend

The trained machine learning model was integrated into a **FastAPI backend**.

FastAPI acts as the bridge between the React frontend and the machine learning model.

The backend is responsible for:

* Loading the trained model.
* Receiving user input.
* Validating input data.
* Passing input to the ML pipeline.
* Generating predictions.
* Returning the prediction to the frontend through a REST API.

---

# 🔌 API Endpoint

The prediction API uses:

```text
POST /predict
```

The frontend sends the student's information to this endpoint.

The FastAPI backend processes the request and returns the predicted mental health score.

---

# 📥 Example API Request

Example input:

```json
{
    "age": 21,
    "gender": "Female",
    "country": "India",
    "academic_level": "Undergraduate",
    "most_used_platform": "Instagram",
    "purpose_of_use": "Entertainment",
    "avg_daily_usage_hours": 4.0,
    "daily_unlocks": 50,
    "study_hours": 3.0,
    "physical_activity_hours": 1.0,
    "sleep_hours_per_night": 7.0,
    "stress_level": "Medium"
}
```

---

# 📤 Example API Response

```json
{
    "predicted_mental_health_score": 6.5
}
```

The actual predicted value depends on the input provided by the user.

---

# ⚛️ React Frontend

A React frontend was developed to provide a user-friendly interface for interacting with the machine learning model.

Instead of directly interacting with the FastAPI endpoint, users can enter their information through the web interface.

The frontend collects the required features and sends them to the backend.

---

# 🖥️ Frontend Workflow

```text
User
 │
 ▼
Enter Student Information
 │
 ▼
React Form
 │
 ▼
API Request
 │
 ▼
FastAPI Backend
 │
 ▼
Machine Learning Pipeline
 │
 ▼
Prediction
 │
 ▼
FastAPI Response
 │
 ▼
React Frontend
 │
 ▼
Display Mental Health Score
```

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│                                             │
│  Student Information Form                   │
│  Lifestyle & Social Media Inputs            │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP Request
                       │ POST /predict
                       ▼
┌─────────────────────────────────────────────┐
│               FastAPI Backend                │
│                                             │
│  Request Validation                         │
│  API Endpoint                               │
│  Model Loading                              │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│        Mental_Health_Model.pkl              │
│                                             │
│  Preprocessing Pipeline                     │
│          +                                  │
│  Random Forest Regressor                    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│          Predicted Mental Health Score      │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
                React Frontend
```

---

## 📁 Project Structure

HEATH SCORE CHECK/
│
├── backend/
│   ├── backend.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── model training/
│   ├── Health_Prediction.ipynb
│   ├── Mental_Health_Model.pkl
│   └── Student_Social_Media_And_Mental_Health_Impact.csv
│
├── LICENSE
└── README.md


> Update the folder names in this section if your actual GitHub repository structure is different.

---

# 🧰 Technologies Used

## Machine Learning

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn
* Joblib

## Machine Learning Techniques

* Data Cleaning
* Exploratory Data Analysis
* Feature Engineering
* Skewness Analysis
* Log Transformation
* Standard Scaling
* Ordinal Encoding
* One-Hot Encoding
* ColumnTransformer
* Pipeline
* Train-Test Split
* Linear Regression
* Random Forest Regression
* RandomizedSearchCV
* Cross-Validation
* Model Evaluation
* Model Serialization

## Backend

* FastAPI
* Pydantic
* Uvicorn
* Python
* REST API

## Frontend

* React.js
* JavaScript
* HTML
* CSS
* REST API Integration

## Development Tools

* Jupyter Notebook
* VS Code
* Git
* GitHub

---

# ▶️ How to Run the Project

## 1. Clone the Repository

Clone the GitHub repository:

```bash
git clone https://github.com/Pramitroy08/Student-Mental-Health-Prediction.git
```

Move into the project directory:

```bash
cd Student-Mental-Health-Prediction
```

---

# 🐍 Running the FastAPI Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

---

## Create a Virtual Environment

On Windows:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

If activation is successful, you should see something similar to:

```text
(venv)
```

at the beginning of your terminal prompt.

---

## Install Backend Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

## Start FastAPI

Run:

```bash
uvicorn main:app --reload
```

The backend will normally start at:

```text
http://localhost:8000
```

---

# 📖 FastAPI Documentation

FastAPI automatically provides interactive API documentation.

After starting the backend, open:

```text
http://localhost:8000/docs
```

This allows you to:

* View the available API endpoints.
* Inspect the request schema.
* Send test requests.
* View API responses.

---

# ⚛️ Running the React Frontend

Open another terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The React application will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser to use the application.

---

# 🔄 Complete Application Flow

The complete application works as follows:

### Step 1 — User Input

The user enters information such as:

```text
Age
Gender
Country
Academic Level
Most Used Platform
Purpose of Use
Average Daily Usage Hours
Daily Unlocks
Study Hours
Physical Activity Hours
Sleep Hours
Stress Level
```

### Step 2 — React Frontend

The React frontend collects the information and sends an HTTP request to the FastAPI backend.

### Step 3 — FastAPI

FastAPI receives and validates the request.

### Step 4 — Machine Learning Pipeline

The saved pipeline processes the input:

```text
Input
 ↓
Transformation
 ↓
Encoding
 ↓
Scaling
 ↓
Random Forest
```

### Step 5 — Prediction

The Random Forest model generates a predicted:

```text
Mental_Health_Score
```

### Step 6 — API Response

FastAPI sends the prediction back to the React frontend.

### Step 7 — User Interface

The React application displays the predicted score to the user.

---

# 🧪 Example Prediction Flow

Suppose a student provides:

```text
Age                         : 21
Gender                      : Female
Country                     : India
Academic Level              : Undergraduate
Most Used Platform          : Instagram
Purpose Of Use              : Entertainment
Average Daily Usage         : 4 hours
Daily Unlocks               : 50
Study Hours                 : 3 hours
Physical Activity           : 1 hour
Sleep                       : 7 hours
Stress Level                : Medium
```

The frontend sends these values to:

```text
POST /predict
```

FastAPI passes the data to the saved machine learning pipeline.

The model then produces a numerical prediction such as:

```text
Mental Health Score ≈ 6.5
```

The exact prediction depends on the trained model and the supplied input.

---

# 📌 Important Note About the Prediction

This project is intended for **educational, analytical, and demonstration purposes**.

The predicted `Mental_Health_Score` is a machine-learning estimate based on patterns found in the dataset.

It should **not** be considered a medical diagnosis, psychological assessment, or replacement for professional mental health support.

---

# ⚠️ Model Limitations

Although the Random Forest model achieved a strong test R² score, several limitations should be considered.

### 1. Dataset Limitations

The model learns only from the available dataset.

If the dataset does not fully represent real-world student populations, the model may not generalize perfectly to every student.

### 2. Correlation Does Not Imply Causation

The project identifies predictive relationships in the data.

It does not prove that social media usage or any other feature directly causes a change in mental health.

### 3. Generalization

The model's performance may change when it is used on data from a different population or environment.

### 4. Prediction Error

The model does not produce perfect predictions.

The evaluation metrics show that some difference between actual and predicted mental health scores remains.

---

# 💡 Why Random Forest?

Random Forest was selected because it can capture nonlinear relationships between features.

For example, the relationship between:

```text
Social Media Usage
        +
Sleep
        +
Study Hours
        +
Stress
        ↓
Mental Health Score
```

may not follow a simple straight-line relationship.

Random Forest can model more complex interactions than a basic Linear Regression model.

---

# 📊 Key Results

The final selected model achieved:

```text
Model : Random Forest Regressor

Testing R² : 0.8776
MAE        : 0.3472
RMSE       : 0.4637
```

Compared with Linear Regression:

```text
Linear Regression R² : 0.7398
Random Forest R²     : 0.8776
```

The Random Forest therefore provided a significant improvement over the baseline model on the test set.

---

# 🧠 Key Learnings

Through this project, I gained practical experience in:

* Understanding a real-world dataset.
* Performing data exploration.
* Checking data quality.
* Handling duplicate records.
* Identifying invalid values.
* Handling outliers.
* Measuring skewness.
* Applying log transformations.
* Performing feature engineering.
* Handling high-cardinality categorical features.
* Choosing appropriate encoding strategies.
* Building preprocessing pipelines.
* Using `ColumnTransformer`.
* Using Scikit-learn `Pipeline`.
* Preventing preprocessing-related data leakage.
* Building a Linear Regression baseline.
* Training a Random Forest Regressor.
* Performing hyperparameter tuning.
* Using cross-validation.
* Evaluating regression models.
* Comparing different models.
* Saving an ML pipeline using Joblib.
* Creating a REST API using FastAPI.
* Connecting a React frontend with a machine learning backend.
* Building an end-to-end machine learning application.

---

# 🔮 Future Improvements

The project can be extended in several ways.

## Machine Learning Improvements

* Try additional regression algorithms.
* Perform more extensive hyperparameter optimization.
* Perform feature selection.
* Analyze feature importance.
* Use SHAP for explainable AI.
* Evaluate the model using additional cross-validation strategies.
* Experiment with ensemble techniques.
* Collect larger and more diverse datasets.

## Backend Improvements

* Add authentication and authorization.
* Store prediction history.
* Add database integration.
* Add API logging.
* Add input validation improvements.
* Add model versioning.
* Add automated testing.
* Deploy the API to a cloud platform.

## Frontend Improvements

* Improve visualization of prediction results.
* Add prediction history.
* Add user accounts.
* Add additional charts.
* Add personalized insights.
* Improve accessibility.
* Add mobile-focused UI improvements.

## Deployment Improvements

The application can be deployed using cloud platforms such as:

```text
Frontend
   ↓
Vercel / Netlify

Backend
   ↓
AWS / Render / Railway

Database
   ↓
MongoDB / PostgreSQL
```

The application could eventually become a fully deployed production-style ML application.

---

# 🚀 Future Architecture

A future production version could look like:

```text
                    ┌─────────────────┐
                    │   React Client  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   API Gateway   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FastAPI Backend │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ ML Model   │ │ Database   │ │ Monitoring │
       └────────────┘ └────────────┘ └────────────┘
```

---

# 📚 Project Highlights

### End-to-End Machine Learning

This project goes beyond model training by connecting:

```text
Machine Learning
      +
FastAPI
      +
React
```

into a complete application.

### Reusable ML Pipeline

Preprocessing and prediction are packaged together, making deployment more reliable.

### Model Comparison

Multiple regression models were evaluated instead of using only one algorithm.

### Hyperparameter Tuning

RandomizedSearchCV was used to search for improved Random Forest parameters.

### REST API

The trained model is exposed through FastAPI so that external applications can interact with it.

### Interactive Frontend

React provides a user-friendly interface for submitting inputs and receiving predictions.

---

# 📂 Main Project Components

## Machine Learning Notebook

The Jupyter Notebook contains:

```text
Data Loading
     ↓
Data Exploration
     ↓
EDA
     ↓
Data Cleaning
     ↓
Feature Engineering
     ↓
Preprocessing
     ↓
Model Training
     ↓
Hyperparameter Tuning
     ↓
Evaluation
     ↓
Model Saving
```

## Trained Model

```text
Mental_Health_Model.pkl
```

This file contains the complete trained preprocessing + Random Forest pipeline.

## FastAPI Backend

The backend loads the saved model and exposes the prediction functionality through a REST API.

## React Frontend

The frontend provides an interactive interface for collecting student information and displaying the model's prediction.

---

# 🛡️ Reproducibility

The project uses:

```python
random_state=42
```

for the train-test split and Random Forest.

This helps make the model training process reproducible under the same environment and dataset.

The hyperparameter search also uses:

```python
random_state=42
```

---

# 📌 Model Performance Summary

```text
                    Test R²       MAE        RMSE
---------------------------------------------------
Linear Regression    0.7398      0.5362     0.6760

Random Forest        0.8776      0.3472     0.4637

Random Forest
(Tuned)              0.8650      0.3689     0.4869
```

### Selected Model

```text
Random Forest (Default)
```

### Test Performance

```text
R²   : 0.8776
MAE  : 0.3472
RMSE : 0.4637
```

---

# 👨‍💻 Author

## Pramit Roy

**GitHub:** [Pramitroy08](https://github.com/Pramitroy08)

**LinkedIn:** [Pramit Roy](https://www.linkedin.com/in/pramit-roy-2785ab2b8/)

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is intended for educational and portfolio purposes.

Please check the dataset's original license and usage terms before redistributing the dataset.

---
