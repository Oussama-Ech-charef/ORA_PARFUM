import Link from 'next/link';
import Image from 'next/image';
import { FiAward, FiStar, FiShield, FiHeart } from 'react-icons/fi';

const values = [
  {
    icon: FiAward,
    title: 'الأناقة',
    description: 'نقدم عطوراً تعكس الذوق الرفيع والتميز في كل تفصيل',
  },
  {
    icon: FiStar,
    title: 'الجودة',
    description: 'ننتقي أفضل المكونات لنضمن تجربة عطرية استثنائية',
  },
  {
    icon: FiShield,
    title: 'التميز',
    description: 'نسعى دائماً لتقديم الأفضل في عالم العطور الفاخرة',
  },
  {
    icon: FiHeart,
    title: 'الثقة',
    description: 'نبني علاقة ثقة مع عملائنا من خلال الجودة والصدق',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-black to-rich-black text-center">
        <div className="ora-container">
          <div className="flex justify-center mb-6">
            <div className="relative w-[160px] h-[50px] md:w-[200px] md:h-[62px]">
              <Image
                src="/logo1.png"
                alt="ORA PARFUM"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">قصتنا</h1>
          <p className="text-warm-gray text-base md:text-lg max-w-2xl mx-auto">
            رحلة من الأناقة والإبداع في عالم العطور الفاخرة
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="ora-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-rich-black mb-4">فلسفة ORA PARFUM</h2>
              <div className="w-16 h-0.5 bg-gold mx-auto" />
            </div>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-warm-gray">
              <p>
                ORA PARFUM علامة تجارية مغربية تجمع بين عراقة المشرق وحداثة الغرب في عالم العطور.
                نحن نؤمن بأن العطر ليس مجرد منتج، بل هو هوية تعبر عن الشخصية وتترك أثراً لا يُنسى.
              </p>
              <p>
                كل عطر في مجموعتنا يُختار بعناية ليعكس قيماً من الأناقة والثقة والتميز.
                نتعاون مع أفضل دور العطور العالمية لنقدم لعملائنا تجربة استثنائية تليق بذوقهم الرفيع.
              </p>
              <p>
                في ORA PARFUM، نجمع بين الحداثة والكلاسيكية لنقدم تشكيلة متنوعة من العطور
                التي تناسب كل الأذواق والمناسبات. نؤمن بأن الجودة هي أساس الثقة، وأن التميز هو طريقنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-ivory">
        <div className="ora-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-rich-black mb-4">قيمنا</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white border border-cream rounded-xl p-6 md:p-8 text-center hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-rich-black mb-2">{v.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-rich-black to-black text-center">
        <div className="ora-container">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">اكتشف عالم ORA PARFUM</h2>
          <p className="text-warm-gray text-base md:text-lg mb-8 max-w-xl mx-auto">
            تصفح مجموعتنا الفاخرة من العطور واختر ما يناسب شخصيتك
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-gold-dark transition-all duration-300 text-base"
          >
            اكتشف مجموعتنا
          </Link>
        </div>
      </section>
    </>
  );
}
