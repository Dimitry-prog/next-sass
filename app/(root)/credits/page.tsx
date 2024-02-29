import { auth, SignedIn } from '@clerk/nextjs';
import Image from 'next/image';

import Checkout from '@/components/shared/checkout';
import { Button } from '@/components/ui/button';
import TransformationTypeHeader from '@/features/transformation/components/header';
import { getUserById } from '@/features/user/actions';
import { plans } from '@/lib/constants';

const CreditPage = async () => {
  const { sessionClaims } = auth();
  const user = await getUserById(sessionClaims?.user?.id as string);

  return (
    <>
      <TransformationTypeHeader
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan) => (
            <li key={plan.name} className="credits-item">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 text-purple-500">{plan.name}</p>
                <p className="h1-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li key={plan.name + inclusion.label} className="flex items-center gap-4">
                    <Image
                      src={`/icons/${inclusion.isIncluded ? 'check.svg' : 'cross.svg'}`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === 'Free' ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    userId={user?.id as string}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default CreditPage;
