import{f as i,a as e,g as p}from"./links.BhxvVKuk.js";import m from"./AdditionalInformation.xalsGO2w.js";import n from"./Category.CfRVBCjo.js";import s from"./Features.CalNXnrW.js";import a from"./Import.Dp9vODwu.js";import c from"./LicenseKey.D1yhSKTL.js";import u from"./SearchAppearance.L42ThifD.js";import l from"./SmartRecommendations.DOkan08R.js";import f from"./Success.vTgFmkgf.js";import d from"./Welcome.B9bzkzbs.js";import{l as S,x as _,o as h}from"./vue.esm-bundler.DzelZkHk.js";import{_ as g}from"./_plugin-vue_export-helper.BN1snXvA.js";import"./default-i18n.BtxsUzQk.js";import"./isArrayLikeObject.CkjpbQo7.js";import"./Wizard.DxwAybe0.js";import"./addons.D3pL3mTq.js";import"./upperFirst.Cx8cdEgZ.js";import"./_stringToArray.DnK4tKcY.js";import"./toString.EVG10Qqs.js";import"./MaxCounts.DHV7qSQX.js";import"./Phone.60d1hBQV.js";import"./preload-helper.B7sCc5Li.js";import"./RadioToggle.XiBFFWmC.js";import"./ImageUploader.DrSIpvuy.js";import"./Caret.Cuasz9Up.js";import"./Img.sJ8H0e44.js";import"./index.DX4OhBfI.js";import"./Plus.CShy191p.js";import"./SocialProfiles.BMg6ptyu.js";import"./Checkbox.CfGJSeWE.js";import"./Checkmark.Du5wcsnR.js";import"./Textarea.BirUpna9.js";import"./SettingsRow.B0N4hwjp.js";import"./Row.ou4tdPuA.js";import"./Twitter.DCBjQ0eg.js";import"./Header.BFHZRCRg.js";import"./Logo.CuK32Muc.js";import"./CloseAndExit.DVnM1FN4.js";import"./Index.DqmzQR7m.js";import"./Steps.DKW42cKi.js";import"./HighlightToggle.BLZDQLdT.js";import"./HtmlTagsEditor.CoHm5iUc.js";import"./tags.Bp6OFtD5.js";import"./Editor.CLGShP5s.js";import"./UnfilteredHtml.CjrgLwaX.js";import"./ImageSeo.rrEIblJk.js";import"./ProBadge.Dgq0taM8.js";import"./popup.Dv7cb5WI.js";import"./params.B3T1WKlC.js";import"./Tags.BmZ4Q9eM.js";import"./postSlug.FF8bFoUR.js";import"./metabox.fwOS5wS6.js";import"./cleanForSlug.C_GG_Tvc.js";import"./_baseTrim.BYZhh0MR.js";import"./get.CmvQfcJ_.js";import"./GoogleSearchPreview.D8LsBN4F.js";import"./strings.BSdKmKF9.js";import"./isString.Dmb68Xbt.js";import"./constants.DARe-ccJ.js";import"./PostTypeOptions.3YhugyPU.js";import"./Tooltip.DcUmvaHX.js";import"./PostTypes.Cef6XkQ_.js";import"./Book.iWCUYtMr.js";import"./VideoCamera.PtujQl9J.js";const y={setup(){return{licenseStore:i(),optionsStore:e(),setupWizardStore:p()}},components:{AdditionalInformation:m,Category:n,Features:s,Import:a,LicenseKey:c,SearchAppearance:u,SmartRecommendations:l,Success:f,Welcome:d},methods:{deleteStage(t){const o=this.setupWizardStore.stages.findIndex(r=>t===r);o!==-1&&this.setupWizardStore.stages.splice(o,1)}},mounted(){if(this.optionsStore.internalOptions.internal.wizard){const t=JSON.parse(this.optionsStore.internalOptions.internal.wizard);delete t.currentStage,delete t.stages,delete t.licenseKey,this.setupWizardStore.loadState(t)}this.setupWizardStore.shouldShowImportStep||this.deleteStage("import"),this.licenseStore.isUnlicensed||this.deleteStage("license-key"),this.$isPro&&this.deleteStage("smart-recommendations")}};function z(t,o,r,x,W,$){return h(),S(_(t.$route.name))}const Rt=g(y,[["render",z]]);export{Rt as default};