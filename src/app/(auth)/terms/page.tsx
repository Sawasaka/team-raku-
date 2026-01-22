'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        {/* 戻るボタン */}
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            トップへ戻る
          </Link>
        </Button>

        <div className="bg-card rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold mb-8 text-center">利用規約</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <p className="text-muted-foreground">
              この利用規約（以下「本規約」）は、株式会社ルーキースマートジャパン（以下「当社」）が提供するサービス「チーム楽」（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意いただいた上で、本サービスをご利用いただきます。
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第1条（適用）</h2>
              <p className="text-muted-foreground leading-relaxed">
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第2条（利用登録）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</li>
                <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第3条（ユーザーIDおよびパスワードの管理）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                <li>当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第4条（利用料金および支払方法）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。</li>
                <li>ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14.6％の割合による遅延損害金を支払うものとします。</li>
                <li>本サービスには3ヶ月間の無料トライアル期間があります。トライアル期間終了後、自動的に有料プランへ移行します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第5条（禁止事項）</h2>
              <p className="text-muted-foreground mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>本サービスによって得られた情報を商業的に利用する行為</li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って本サービスを利用する行為</li>
                <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第6条（本サービスの提供の停止等）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第7条（退会）</h2>
              <p className="text-muted-foreground leading-relaxed">
                ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。退会した場合、有料プランの利用料金は日割り計算での返金は行われません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第8条（保証の否認および免責事項）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第9条（サービス内容の変更等）</h2>
              <p className="text-muted-foreground leading-relaxed">
                当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第10条（利用規約の変更）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                    <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
                  </ul>
                </li>
                <li>当社はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第11条（個人情報の取扱い）</h2>
              <p className="text-muted-foreground leading-relaxed">
                当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">第12条（準拠法・裁判管轄）</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
              </ol>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                制定日：2026年1月19日<br />
                株式会社ルーキースマートジャパン
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
