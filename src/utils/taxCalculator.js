// 2024 年度台灣綜合所得稅計算

export const EXEMPTION_GENERAL = 97000;
export const EXEMPTION_SENIOR = 145500;       // 70歲以上
export const STANDARD_DEDUCTION_SINGLE = 131000;
export const STANDARD_DEDUCTION_MARRIED = 262000;
export const SALARY_SPECIAL_DEDUCTION = 218000;
export const SAVINGS_INVESTMENT_CAP = 270000;
export const BASIC_LIVING_PER_PERSON = 210000;
export const INSURANCE_CAP_PER_PERSON = 24000;
export const RENT_CAP = 180000;
export const MORTGAGE_CAP = 300000;

const TAX_BRACKETS = [
  { limit: 590000,   rate: 0.05, diff: 0 },
  { limit: 1330000,  rate: 0.12, diff: 41300 },
  { limit: 2660000,  rate: 0.20, diff: 147700 },
  { limit: 4980000,  rate: 0.30, diff: 413700 },
  { limit: Infinity, rate: 0.40, diff: 911700 },
];

export function formatNumber(num) {
  return Math.round(num).toLocaleString('zh-TW');
}

export function calculateTax(formData) {
  const {
    salary = 0,
    married = false,
    dependents = 0,
    seniorDependents = 0,
    youngChildren = 0,
    insurance = 0,
    medical = 0,
    rent = 0,
    mortgage = 0,
    donation = 0,
    savingsInterest = 0,
  } = formData;

  const spouseCount = married ? 1 : 0;
  const normalDependents = Math.max(0, dependents - seniorDependents);
  const totalPeople = 1 + spouseCount + dependents;

  // 免稅額
  const totalExemption =
    EXEMPTION_GENERAL * (1 + spouseCount + normalDependents) +
    EXEMPTION_SENIOR * seniorDependents;

  // 標準扣除額
  const standardDeduction = married ? STANDARD_DEDUCTION_MARRIED : STANDARD_DEDUCTION_SINGLE;

  // 薪資特別扣除額（上限為薪資收入）
  const salarySpecialDeduction = Math.min(salary, SALARY_SPECIAL_DEDUCTION);

  // 儲蓄投資特別扣除額
  const savingsDeduction = Math.min(savingsInterest, SAVINGS_INVESTMENT_CAP);

  // 列舉扣除額各項目
  const insuranceCap = INSURANCE_CAP_PER_PERSON * totalPeople;
  const effectiveInsurance = Math.min(insurance, insuranceCap);
  const effectiveMedical = medical;
  const effectiveRent = Math.min(rent, RENT_CAP);
  // 房貸利息上限扣除儲蓄投資扣除額後之餘額
  const mortgageCap = Math.max(0, MORTGAGE_CAP - savingsDeduction);
  const effectiveMortgage = Math.min(mortgage, mortgageCap);
  const donationCap = salary * 0.2;
  const effectiveDonation = Math.min(donation, donationCap);

  const itemizedDeduction =
    effectiveInsurance + effectiveMedical + effectiveRent +
    effectiveMortgage + effectiveDonation;

  // 選較優扣除方式
  const useItemized = itemizedDeduction > standardDeduction;
  const chosenDeduction = useItemized ? itemizedDeduction : standardDeduction;
  const deductionSavings = Math.abs(itemizedDeduction - standardDeduction);

  // 基本生活費差額（固定以標準扣除額比較）
  const basicLivingTotal = BASIC_LIVING_PER_PERSON * totalPeople;
  const baseCompare = totalExemption + standardDeduction + salarySpecialDeduction;
  const basicLivingDiff = Math.max(0, basicLivingTotal - baseCompare);

  // 所得淨額
  const netIncome = Math.max(
    0,
    salary - totalExemption - chosenDeduction - salarySpecialDeduction - savingsDeduction - basicLivingDiff,
  );

  // 應繳稅額
  const bracket = TAX_BRACKETS.find(b => netIncome <= b.limit);
  const taxRate = bracket.rate;
  const estimatedTax = Math.max(0, Math.round(netIncome * taxRate - bracket.diff));

  return {
    salary, married, dependents, seniorDependents, youngChildren,
    normalDependents, totalPeople,
    totalExemption,
    standardDeduction,
    salarySpecialDeduction,
    savingsDeduction,
    insuranceCap,
    effectiveInsurance, effectiveMedical, effectiveRent, effectiveMortgage, effectiveDonation,
    itemizedDeduction,
    useItemized, chosenDeduction, deductionSavings,
    basicLivingTotal, basicLivingDiff,
    netIncome,
    taxRate, estimatedTax,
    // raw inputs for tips
    insurance, medical, rent, mortgage, donation, savingsInterest,
  };
}

export function generateTips(result) {
  const tips = [];

  if (result.useItemized) {
    tips.push({
      type: 'success',
      title: '建議採用列舉扣除額',
      content: `您的列舉扣除額（${formatNumber(result.itemizedDeduction)} 元）高於標準扣除額（${formatNumber(result.standardDeduction)} 元），採用列舉可多省 ${formatNumber(result.deductionSavings)} 元。`,
    });
  } else {
    tips.push({
      type: 'info',
      title: '目前標準扣除額較有利',
      content: `標準扣除額（${formatNumber(result.standardDeduction)} 元）高於您填寫的列舉扣除額（${formatNumber(result.itemizedDeduction)} 元），列舉金額需再增加 ${formatNumber(result.deductionSavings)} 元才划算。`,
    });
  }

  if (result.insurance < result.insuranceCap) {
    const gap = result.insuranceCap - result.insurance;
    tips.push({
      type: 'warning',
      title: '人身保險費尚未達上限',
      content: `您申報的保險費（${formatNumber(result.insurance)} 元）距可扣除上限（每人 24,000 元 × ${result.totalPeople} 人 = ${formatNumber(result.insuranceCap)} 元）還差 ${formatNumber(gap)} 元，可考慮補足壽險或醫療險保單。`,
    });
  }

  if (!result.rent && !result.mortgage) {
    tips.push({
      type: 'warning',
      title: '提醒確認租屋或自住房貸',
      content: `有租屋支出可列舉扣除（上限 18 萬元），自住房貸利息也可列舉（上限 30 萬元）。若有此類支出但未填寫，建議補填以確認是否更划算。`,
    });
  }

  if (result.basicLivingDiff > 0) {
    tips.push({
      type: 'success',
      title: '基本生活費差額已自動計入',
      content: `系統已額外扣除基本生活費差額 ${formatNumber(result.basicLivingDiff)} 元（每人 21 萬 × ${result.totalPeople} 人 = ${formatNumber(result.basicLivingTotal)} 元，超出免稅額與標準扣除合計的部分）。`,
    });
  }

  if (result.youngChildren > 0) {
    tips.push({
      type: 'info',
      title: '幼兒學前特別扣除額',
      content: `您有 ${result.youngChildren} 位 5 歲以下幼兒，每人可申報幼兒學前特別扣除額 120,000 元，合計 ${formatNumber(result.youngChildren * 120000)} 元（本試算未計入，實際申報時請記得申請）。`,
    });
  }

  if (result.seniorDependents > 0) {
    tips.push({
      type: 'info',
      title: '長照特別扣除額',
      content: `您的 ${result.seniorDependents} 位長輩若符合長期照顧需求，每人可再申報長照特別扣除額 120,000 元（本試算未計入），建議向醫療機構確認是否符合資格。`,
    });
  }

  if (result.taxRate >= 0.20) {
    tips.push({
      type: 'info',
      title: '可考慮公益捐贈節稅',
      content: `您的稅率達 ${result.taxRate * 100}%，對政府立案公益機構捐贈，最多可扣除所得總額的 20%（上限 ${formatNumber(result.salary * 0.2)} 元），在高稅率下節稅效益顯著。`,
    });
  }

  if (result.married) {
    tips.push({
      type: 'info',
      title: '已婚者可試算薪資分開計稅',
      content: `配偶薪資所得可選擇與您分開計算稅率（各自套用級距），若雙方收入差距較大，分開申報可能更有利，建議利用財政部「綜合所得稅試算系統」比較兩種方案。`,
    });
  }

  return tips;
}
