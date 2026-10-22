const a=["Data work","Regression","Causal inference","Time series","Output and graphs","Simulation and models","Getting data"],t=[{id:"load",area:"Data work",title:"Load and inspect a dataset",why:"Always look at your data before estimating anything: types, missing values, odd values.",stata:`* Stata
import delimited "survey.csv", clear
describe
summarize
codebook income, compact
tabulate district, missing`,r:`# R
library(readr); library(dplyr)
df <- read_csv("survey.csv")
glimpse(df)
summary(df)
count(df, district)`,python:`# Python
import pandas as pd
df = pd.read_csv("survey.csv")
df.info()
print(df.describe())
print(df["district"].value_counts(dropna=False))`,notes:["Check the number of observations against the survey documentation.","Look for codes such as -99 or 999 that mean missing."]},{id:"clean",area:"Data work",title:"Create and clean variables",why:"Logs, dummies and recoding missing values are most of empirical work.",stata:`replace income = . if income < 0
gen log_income = ln(income)
gen female = (sex == 2) if !missing(sex)
gen age2 = age^2
label variable log_income "Log of household income"`,r:`df <- df |>
  mutate(income = if_else(income < 0, NA_real_, income),
         log_income = log(income),
         female = as.integer(sex == 2),
         age2 = age^2)`,python:`import numpy as np
df.loc[df["income"] < 0, "income"] = np.nan
df["log_income"] = np.log(df["income"])
df["female"] = (df["sex"] == 2).astype(int)
df["age2"] = df["age"] ** 2`,notes:["The log of zero is undefined: decide how to treat zero incomes and say so.","In Stata, a comparison with missing is true for '>' because missing counts as very large: add !missing()."]},{id:"groups",area:"Data work",title:"Summary statistics by group",why:"The first table of most papers: means by treatment, region or year.",stata:`tabstat income age, by(district) statistics(mean sd n)
collapse (mean) income (count) n=income, by(district year)`,r:`df |>
  group_by(district) |>
  summarise(mean_income = mean(income, na.rm = TRUE),
            sd_income = sd(income, na.rm = TRUE),
            n = n())`,python:'df.groupby("district")["income"].agg(["mean", "std", "count"])',notes:["collapse replaces the data in memory in Stata: use preserve and restore around it."]},{id:"merge",area:"Data work",title:"Merge two datasets",why:"Joining household data with district data, or survey rounds with each other.",stata:`* one district row matches many households
merge m:1 district using "district_data.dta"
tabulate _merge
keep if _merge == 3
drop _merge`,r:`df <- df |> left_join(district_data, by = "district")
# check unmatched rows
anti_join(df, district_data, by = "district")`,python:`df = df.merge(district_data, on="district", how="left",
              validate="m:1", indicator=True)
print(df["_merge"].value_counts())`,notes:["Always check how many rows matched; silent mismatches are a classic error.","Make sure key variables have the same type and spelling in both files."]},{id:"reshape",area:"Data work",title:"Reshape between wide and long",why:"Panel estimation needs long format: one row per unit and year.",stata:`* wide: income2019 income2020 ...
reshape long income, i(hhid) j(year)`,r:`library(tidyr)
long <- df |> pivot_longer(starts_with("income"),
          names_to = "year", names_prefix = "income",
          values_to = "income")`,python:'long = pd.wide_to_long(df, stubnames="income", i="hhid", j="year").reset_index()',notes:["Check that the unit identifier is unique before reshaping."]},{id:"ols",area:"Regression",title:"OLS with robust standard errors",why:"The basic regression, with heteroskedasticity-robust inference.",topic:"ols-inference",stata:"regress log_income years_school age age2 female, vce(robust)",r:`library(fixest)
m <- feols(log_income ~ years_school + age + age2 + female,
           data = df, vcov = "hetero")
summary(m)`,python:`import statsmodels.formula.api as smf
m = smf.ols("log_income ~ years_school + age + age2 + female", data=df).fit(cov_type="HC1")
print(m.summary())`,notes:["Robust standard errors fix inference, not bias.","Report the number of observations and how missing values were handled."]},{id:"cluster",area:"Regression",title:"Clustered standard errors",why:"When observations in the same village or school are correlated, ordinary standard errors are too small.",topic:"ols-inference",stata:"regress y treat x1 x2, vce(cluster village)",r:"m <- feols(y ~ treat + x1 + x2, data = df, cluster = ~village)",python:`m = smf.ols("y ~ treat + x1 + x2", data=df).fit(
    cov_type="cluster", cov_kwds={"groups": df["village"]})`,notes:["Cluster at the level at which treatment is assigned.","With fewer than about 30 to 40 clusters, use the wild cluster bootstrap (boottest in Stata, fwildclusterboot in R)."]},{id:"fe",area:"Regression",title:"Panel fixed effects",why:"Remove everything about a unit that does not change over time, and common year shocks.",topic:"panel-fe",stata:`* ssc install reghdfe
reghdfe y x1 x2, absorb(hhid year) vce(cluster hhid)

* built-in alternative (unit effects only)
xtset hhid year
xtreg y x1 x2 i.year, fe vce(cluster hhid)`,r:`m <- feols(y ~ x1 + x2 | hhid + year, data = df, cluster = ~hhid)
etable(m)`,python:`# pip install pyfixest
import pyfixest as pf
m = pf.feols("y ~ x1 + x2 | hhid + year", data=df, vcov={"CRV1": "hhid"})
m.summary()`,notes:["Fixed effects cannot estimate the effect of variables that never change within a unit.","Within variation is often small: report how much x varies within units."]},{id:"logit",area:"Regression",title:"Logit or probit with marginal effects",why:"For yes or no outcomes such as migrating, enrolling or borrowing.",stata:`logit migrated age female land, vce(robust)
margins, dydx(*)`,r:`m <- glm(migrated ~ age + female + land, family = binomial, data = df)
library(marginaleffects)
avg_slopes(m)`,python:`m = smf.logit("migrated ~ age + female + land", data=df).fit()
print(m.get_margeff().summary())`,notes:["Report average marginal effects, not raw coefficients, so readers can interpret magnitudes.","A linear probability model with robust errors is a common, transparent alternative."]},{id:"iv",area:"Causal inference",title:"Instrumental variables (2SLS)",why:"When the regressor is endogenous and you have an instrument.",topic:"endogeneity-iv",stata:`ivregress 2sls y x1 (d = z), vce(robust)
estat firststage`,r:`m <- feols(y ~ x1 | d ~ z, data = df, vcov = "hetero")
summary(m, stage = 1:2)
fitstat(m, ~ ivf)`,python:`from linearmodels.iv import IV2SLS
m = IV2SLS.from_formula("y ~ 1 + x1 + [d ~ z]", data=df).fit(cov_type="robust")
print(m.summary)
print(m.first_stage)`,notes:["Always report the first stage; a weak first stage (small F statistic) makes IV unreliable.","Argue the exclusion restriction in words: it cannot be tested with one instrument."]},{id:"did",area:"Causal inference",title:"Difference-in-differences (two groups, two periods)",why:"Compare changes in treated and comparison groups.",topic:"did",stata:`gen treat_post = treat * post
regress y treat post treat_post, vce(cluster district)`,r:`df$treat_post <- df$treat * df$post
m <- feols(y ~ treat + post + treat_post, data = df, cluster = ~district)`,python:`m = smf.ols("y ~ treat * post", data=df).fit(
    cov_type="cluster", cov_kwds={"groups": df["district"]})
# the coefficient on treat:post is the DiD estimate`,notes:["Plot the means of both groups over time first: are pre-trends parallel?","With units and years, use unit and year fixed effects instead of treat and post."]},{id:"event",area:"Causal inference",title:"Event study and staggered adoption",why:"When units are treated at different times, plot effects by time since treatment and use estimators robust to staggered timing.",topic:"did",stata:`* staggered DiD (Callaway and Sant'Anna); ssc install csdid drdid
* first_treat = year first treated, 0 if never treated
csdid y, ivar(id) time(year) gvar(first_treat) notyet
estat event`,r:`# event study with fixest; rel_time = year - first_treat
m <- feols(y ~ i(rel_time, ever_treated, ref = -1) | id + year,
           data = df, cluster = ~id)
iplot(m)

# Callaway and Sant'Anna
library(did)
att <- att_gt(yname = "y", tname = "year", idname = "id",
              gname = "first_treat", data = df)
aggte(att, type = "dynamic")`,python:`import pyfixest as pf
# rel_time = year - first_treat, set to -1 for never treated
m = pf.feols("y ~ i(rel_time, ref=-1) | id + year", data=df, vcov={"CRV1": "id"})
m.iplot()`,notes:["Two way fixed effects with staggered timing can be badly biased when effects change over time: use these newer estimators.","Leads (negative relative times) should be near zero if parallel trends holds."]},{id:"rd",area:"Causal inference",title:"Regression discontinuity",why:"When treatment switches on at a cut-off in a running variable.",topic:"rdd",stata:`* ssc install rdrobust
rdrobust y score, c(50)
rdplot y score, c(50)`,r:`library(rdrobust)
summary(rdrobust(df$y, df$score, c = 50))
rdplot(df$y, df$score, c = 50)`,python:`# pip install rdrobust
from rdrobust import rdrobust, rdplot
print(rdrobust(y=df["y"], x=df["score"], c=50))
rdplot(y=df["y"], x=df["score"], c=50)`,notes:["Test for manipulation of the running variable (rddensity) and check that covariates are smooth at the cut-off.","Report results for several bandwidths."]},{id:"weights",area:"Causal inference",title:"Survey weights and design",why:"National surveys such as NLSS and NLFS sample with clusters, strata and weights; ignore them and estimates are biased and standard errors wrong.",stata:`svyset psu [pweight = weight], strata(stratum)
svy: mean consumption
svy: regress log_cons hh_size remittance`,r:`library(survey)
des <- svydesign(ids = ~psu, strata = ~stratum, weights = ~weight,
                 data = df, nest = TRUE)
svymean(~consumption, des, na.rm = TRUE)
svyglm(log_cons ~ hh_size + remittance, design = des)`,python:`# weighted point estimate
import numpy as np
np.average(df["consumption"], weights=df["weight"])
# weighted regression (point estimates); design-based standard errors need a survey package such as samplics
m = smf.wls("log_cons ~ hh_size + remittance", data=df, weights=df["weight"]).fit(
    cov_type="cluster", cov_kwds={"groups": df["psu"]})`,notes:["Read the survey's sampling documentation for the names of weight, cluster and stratum variables.","Poverty and inequality statistics should always use weights."]},{id:"arima",area:"Time series",title:"Unit roots and AR models",why:"Forecasting inflation or remittances, and checking whether a series is stationary.",topic:"time-series-arma",stata:`tsset month
dfuller inflation, lags(4)
arima inflation, arima(1,0,0)
predict f, y`,r:`library(tseries)
adf.test(ts_data$inflation)
m <- arima(ts_data$inflation, order = c(1, 0, 0))
predict(m, n.ahead = 12)`,python:`from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
print(adfuller(df["inflation"].dropna()))
m = ARIMA(df["inflation"], order=(1, 0, 0)).fit()
print(m.forecast(12))`,notes:["Regressing one trending series on another gives spurious results: test for unit roots first."]},{id:"var",area:"Time series",title:"Vector autoregression and impulse responses",why:"How a shock to one variable (for example Indian inflation) spreads to others (Nepali inflation).",stata:`tsset quarter
var nepal_inf india_inf remit_growth, lags(1/2)
irf create base, set(myirf) step(8)
irf graph oirf, impulse(india_inf) response(nepal_inf)`,r:`library(vars)
m <- VAR(ts_data[, c("india_inf", "nepal_inf", "remit_growth")], p = 2)
plot(irf(m, impulse = "india_inf", response = "nepal_inf", n.ahead = 8))`,python:`from statsmodels.tsa.api import VAR
m = VAR(df[["india_inf", "nepal_inf", "remit_growth"]]).fit(2)
m.irf(8).plot(impulse="india_inf", response="nepal_inf")`,notes:["Orthogonalised impulse responses depend on the ordering of variables: justify it."]},{id:"plot",area:"Output and graphs",title:"Scatter plot with a fitted line",why:"Show the raw relationship before any regression.",stata:`twoway (scatter log_income years_school, msize(small)) (lfit log_income years_school)
graph export "fig1.png", replace`,r:`library(ggplot2)
ggplot(df, aes(years_school, log_income)) +
  geom_point(alpha = 0.3) + geom_smooth(method = "lm") +
  labs(x = "Years of schooling", y = "Log income")
ggsave("fig1.png", width = 6, height = 4)`,python:`import seaborn as sns, matplotlib.pyplot as plt
sns.regplot(data=df, x="years_school", y="log_income", scatter_kws={"alpha": 0.3})
plt.xlabel("Years of schooling"); plt.ylabel("Log income")
plt.savefig("fig1.png", dpi=200)`,notes:["With many points, a binned scatter plot is clearer (binscatter in Stata, binsreg in all three)."]},{id:"tables",area:"Output and graphs",title:"Regression tables for your paper",why:"Publication quality tables straight into LaTeX or Word.",stata:`* ssc install estout
eststo clear
eststo: regress y x1, vce(robust)
eststo: regress y x1 x2, vce(robust)
esttab using "table1.tex", se star(* 0.10 ** 0.05 *** 0.01) replace`,r:`library(modelsummary)
m1 <- feols(y ~ x1, df, vcov = "hetero")
m2 <- feols(y ~ x1 + x2, df, vcov = "hetero")
modelsummary(list(m1, m2), stars = TRUE, output = "table1.tex")`,python:`import pyfixest as pf
m1 = pf.feols("y ~ x1", data=df, vcov="hetero")
m2 = pf.feols("y ~ x1 + x2", data=df, vcov="hetero")
pf.etable([m1, m2], type="tex")`,notes:["Never copy numbers into tables by hand: generate them with code so they always match."]},{id:"montecarlo",area:"Simulation and models",title:"Monte Carlo: see OLS bias with your own eyes",why:"Simulating data where you know the truth is the best way to understand estimators.",topic:"endogeneity-iv",stata:`program define sim, rclass
  clear
  set obs 500
  gen ability = rnormal()
  gen school = 10 + 2*ability + rnormal()
  gen wage = 1 + 0.08*school + 0.3*ability + rnormal()
  regress wage school
  return scalar b = _b[school]
end
simulate b = r(b), reps(1000) seed(42): sim
summarize b   // mean well above the true 0.08`,r:`set.seed(42)
b <- replicate(1000, {
  ability <- rnorm(500)
  school <- 10 + 2 * ability + rnorm(500)
  wage <- 1 + 0.08 * school + 0.3 * ability + rnorm(500)
  coef(lm(wage ~ school))["school"]
})
mean(b)  # well above the true 0.08: omitted ability bias`,python:`import numpy as np
rng = np.random.default_rng(42)
b = []
for _ in range(1000):
    ability = rng.normal(size=500)
    school = 10 + 2 * ability + rng.normal(size=500)
    wage = 1 + 0.08 * school + 0.3 * ability + rng.normal(size=500)
    b.append(np.polyfit(school, wage, 1)[0])
print(np.mean(b))  # well above 0.08`,notes:["By the omitted variable formula the mean is about 0.08 + 0.3 times 2/5 = 0.20: try it, then add ability as a control and watch the bias vanish."]},{id:"solow-sim",area:"Simulation and models",title:"Simulate the Solow model",why:"Watch capital converge to the steady state, then change the saving rate.",topic:"solow",stata:`clear
set obs 100
gen t = _n
gen k = 1 in 1
local s 0.25
local nd 0.07
local a 0.33
replace k = k[_n-1] + \`s'*k[_n-1]^\`a' - \`nd'*k[_n-1] in 2/l
line k t`,r:`s <- 0.25; nd <- 0.07; a <- 0.33
k <- numeric(100); k[1] <- 1
for (t in 2:100) k[t] <- k[t-1] + s * k[t-1]^a - nd * k[t-1]
plot(k, type = "l"); abline(h = (s / nd)^(1 / (1 - a)), lty = 2)`,python:`import numpy as np, matplotlib.pyplot as plt
s, nd, a = 0.25, 0.07, 0.33
k = np.ones(100)
for t in range(1, 100):
    k[t] = k[t-1] + s * k[t-1]**a - nd * k[t-1]
plt.plot(k); plt.axhline((s / nd)**(1 / (1 - a)), ls="--"); plt.show()`,notes:["The dashed line is the steady state from the formula book; the simulation should approach it."]},{id:"optimise",area:"Simulation and models",title:"Solve an optimisation problem numerically",why:"When a model has no closed form, let the computer maximise.",topic:"lagrange",stata:"* Stata: use Mata's optimize() for numerical problems; most economists switch to R, Python or Julia for this",r:`# maximise Cobb-Douglas utility on a budget: x = a*m/px analytically
u <- function(x, a = 0.4, m = 2000, px = 20, py = 10) {
  y <- (m - px * x) / py
  -(a * log(x) + (1 - a) * log(y))
}
optimize(function(x) u(x), c(0.01, 99.99))$minimum  # about 40`,python:`import numpy as np
from scipy.optimize import minimize_scalar
a, m, px, py = 0.4, 2000, 20, 10
neg_u = lambda x: -(a * np.log(x) + (1 - a) * np.log((m - px * x) / py))
print(minimize_scalar(neg_u, bounds=(0.01, 99.99), method="bounded").x)  # about 40`,notes:["Always check a numerical answer against a case you can solve by hand: here x = a m / px = 40."]},{id:"worldbank",area:"Getting data",title:"Download World Bank data directly",why:"Get the same indicators as the data lab into your own analysis, reproducibly.",stata:`* ssc install wbopendata
wbopendata, indicator(BX.TRF.PWKR.DT.GD.ZS) country(NPL;BGD;IND) clear long`,r:`library(WDI)
d <- WDI(country = c("NP", "BD", "IN"),
         indicator = c(remit = "BX.TRF.PWKR.DT.GD.ZS"),
         start = 1990, end = 2025)`,python:`# pip install wbgapi
import wbgapi as wb
d = wb.data.DataFrame("BX.TRF.PWKR.DT.GD.ZS", ["NPL", "BGD", "IND"],
                      time=range(1990, 2026), labels=True)`,notes:["Indicator codes are shown in the data lab under each chart.","Record the download date: the World Bank revises data."]},{id:"project",area:"Getting data",title:"A reproducible project layout",why:"Referees, supervisors and your future self must be able to rerun everything.",stata:`* master.do
version 18
clear all
set more off
global root "~/Research/remittances"
do "$root/code/01_clean.do"
do "$root/code/02_analysis.do"
do "$root/code/03_tables.do"`,r:`# project/
#   data/raw/        never edited by hand
#   data/clean/
#   code/01_clean.R  02_analysis.R  03_tables.R
#   output/figures/  output/tables/
#   paper/
# Use an RStudio project or the here package for paths:
library(here)
df <- readr::read_csv(here("data", "raw", "survey.csv"))`,python:`# Same layout; run everything from one script:
# python code/01_clean.py && python code/02_analysis.py
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
df = pd.read_csv(ROOT / "data" / "raw" / "survey.csv")`,notes:["Keep raw data read only.","Use git for code (not for large data files).","One script that rebuilds every table and figure from raw data is the gold standard."]}];Object.fromEntries(t.map(e=>[e.id,e]));export{t as C,a};
